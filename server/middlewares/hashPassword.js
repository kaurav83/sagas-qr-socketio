const bcrypt = require('bcrypt');
const { SALT_ROUND } = require('../configs/constants');
const EmptyUserError = require('../errors/EmptyUserError');

module.exports.hashPass = async(req, res, next) => {
    try {
        if(Object.keys(req.body).length ===0) {
            throw new EmptyUserError('User can`t be empty');
        }
        const {body, body: {password}} = req;

        req.passwordHash = await bcrypt.hash(password, SALT_ROUND);
        delete body.password;

        next();
    } catch (error) {
        next(error);
    }
}