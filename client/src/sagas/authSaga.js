import { registerUser, loginUser, authUser, logOut } from '../api/axiosApi'
import { loginUserSuccess, loginUserError, registerUserSuccess, registerUserError, authUserSuccess, authUserError, authByQRCodeError, authByQRCodeSuccess } from "../actions/actionCreator";
import { put } from 'redux-saga/effects';
import history from '../BrowserHistory';
import { authByQRCode } from '../api/AuthByQRCodeApi';

export function* loginSaga(action) {
    try {
        const {data: {data}} = yield loginUser(action.payload);
        yield put(loginUserSuccess(data));
        history.push('/tasks');
    } catch (error) {
        yield put(loginUserError(error.response.data.error));
    }
}

export function* registerSaga(action) {
    try {
        const {data: {data}} = yield registerUser(action.payload);
        yield put(registerUserSuccess(data));
        history.push('/tasks');
    } catch (error) {
        yield put(registerUserError(error.response.data.error));
    }
}

export function* authSaga(action) {
    try {
        const {data: {data}} = yield authUser();
        yield put(authUserSuccess(data));
    } catch (error) {
        yield put(authUserError(error));
    }
}

export function* logOutSaga(action) {
    yield logOut();
    history.push('/');
}

export function* authByQRCodeSaga(action) {
    try {
        // 1: request on API
        const { data } = yield authByQRCode({
            refreshToken: action.payload
        });
        console.log(data);

        // 2: tokenPair => localStorage
        const { tokens: { accessToken, refreshToken } } = data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        // 3: redirect on /tasks
        history.push('/tasks');

        yield put(authByQRCodeSuccess(data));

    } catch (error) {
        yield put(authByQRCodeError(error));
    }
}