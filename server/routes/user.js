const {Router} = require('express');
const UserController = require('../controllers/user.controller');
const {hashPass} = require('../middlewares/hashPassword');
const { checkToken } = require('../middlewares/checkToken');

const userRouter = Router();

userRouter.post('/sign-up', hashPass, UserController.registatrionUser); // register
userRouter.post('/sign-in', UserController.loginUser); // login
userRouter.get('/', checkToken, UserController.checkAuth);
userRouter.post('/refresh', UserController.refreshSession);
userRouter.post('/authByQRCode', UserController.createNewTokenPairByQRAuth);

module.exports = userRouter;