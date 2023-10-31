const bcrypt = require('bcrypt');
const { User, RefreshToken } = require('../models');
const RefreshTokenError = require('../errors/RefreshTokenError');
const NotFoundError = require('../errors/NotFound');
const {createAccessToken, verifyAccessToken, createRefreshToken, verifyRefreshToken } = require('../services/tokenService');

module.exports.registatrionUser = async (req, res, next) => {
    try {
        const {body, passwordHash} = req;

        const createdUser = await User.create({...body, passwordHash});

        const accessToken = await createAccessToken({userId: createdUser._id, email: createdUser.email});
        const refreshToken = await createRefreshToken({userId: createdUser._id, email: createdUser.email});

        const addedToken = await RefreshToken.create({
            token: refreshToken,
            userId: createdUser._id
        })

        return res.status(201).send({data: createdUser, tokens: { accessToken, refreshToken }});
    } catch (error) {
        next(error);
    }
}

module.exports.loginUser = async (req, res, next) => {
    try {
        const { body } = req;
        const foundUser = await User.findOne({
            email: body.email
        });
        if(foundUser) {
            const result = await bcrypt.compare(body.password, foundUser.passwordHash);
            if(!result) {
                throw new NotFoundError('Incorrect password');
            }
            const accessToken = await createAccessToken({userId: foundUser._id, email: foundUser.email});
            const refreshToken = await createRefreshToken({userId: foundUser._id, email: foundUser.email});
            const addedToken = await RefreshToken.create({
                token: refreshToken,
                userId: foundUser._id
            })
            return res.status(200).send({data: foundUser, tokens: {accessToken, refreshToken}});
        } else {
            throw new NotFoundError('Incorrect email');
        }
    } catch (error) {
        next(error);
    }
}

module.exports.checkAuth = async(req, res, next) => {
    try {
        const {tokenPayload: {email}} = req;
        
        const foundUser = await User.findOne({
            email: email
        });
        return res.status(200).send({data: foundUser});
    } catch (error) {
        next(error);
    }
}

module.exports.refreshSession = async (req, res, next) => {
    /*
        AccessToken - живе мало, багаторазовий, саме з ним ми і робимо всі наші запити
        RefreshToken - живе довго, одноразовий, призначений для оновлення пари Access і Refresh токенів
        Access Token + Refresh Token = Token Pair (пара токенів)

        1. Приходить запит з access-токеном
            - Якщо Access Token валідний - працюємо: виконуємо запит, повертаємо відповідь
            - Якщо Access Token НЕ валідний (прострочився):
                1. Відповідаємо певним кодом помилки
                2. У відповідь на цю помилку, фронт-частина надсилає Refresh Token
                    - Якщо цей Refresh Token валідний, то "рефрешимо" всю сесію - видаємо нову пару токенів
                    - Якщо цей Refresh Token НЕ валідний, то перенаправляємо користувача на авторизацію
    */
    
    const { body: {refreshToken} } = req;
    let verifyResult;

    try {
        verifyResult = await verifyRefreshToken(refreshToken);
    } catch (error) {
        const newError = new RefreshTokenError('Invalid refresh token');
        return next(newError);
    }
    try {
        if(verifyResult) {
            // Дістаємо сутність юзера з БД
            const foundUser = await User.findOne({
                email: verifyResult.email
            });
            // Дістаємо сутність токена з БД
            const rTFromDB = await RefreshToken.findOne({$and: [{token: refreshToken}, {userId: foundUser._id}]});

            if(rTFromDB) {
                // Видаляємо попередній refresh token
                // const removeResult = await rTFromDB.remove(); <<<---- REMOVED METHOD FROM MONGOOSE
                const removeResult = await RefreshToken.deleteOne({$and: [{token: refreshToken}, {userId: foundUser._id}]});
                // Використовуємо сервіси для створення access і refresh токенів
                const newAccessToken = await createAccessToken({userId: foundUser._id, email: foundUser.email});
                const newRefreshToken = await createRefreshToken({userId: foundUser._id, email: foundUser.email});
                const addedToken = await RefreshToken.create({
                    token: newRefreshToken,
                    userId: foundUser._id
                });

                return res.status(200).send({tokens: {accessToken: newAccessToken, refreshToken: newRefreshToken}})
            } else {
                throw new RefreshTokenError('Token not found');
            }
        }
    } catch (error) {
        next(error);
    }
}

module.exports.createNewTokenPairByQRAuth = async (req, res, next) => {
    try {
        const {body: { refreshToken } } = req;
        const verifyResult = await verifyRefreshToken(refreshToken);
        
        if(verifyResult) {
            // Дістаємо сутність юзера з БД
            const foundUser = await User.findOne({
                email: verifyResult.email
            });
            // Дістаємо сутність токена з БД
            const rTFromDB = await RefreshToken.findOne({$and: [{token: refreshToken}, {userId: foundUser._id}]});
            if(rTFromDB) {
                const newAccessToken = await createAccessToken({userId: foundUser._id, email: foundUser.email});
                const newRefreshToken = await createRefreshToken({userId: foundUser._id, email: foundUser.email});
                const addedToken = await RefreshToken.create({
                    token: newRefreshToken,
                    userId: foundUser._id
                });
    
                return res.status(200).send({
                    tokens: 
                    {
                        accessToken: newAccessToken, 
                        refreshToken: newRefreshToken
                    }})
            }    
        } else {
            throw new RefreshTokenError('Token not found');
        }
    } catch (error) {
        
    }
}