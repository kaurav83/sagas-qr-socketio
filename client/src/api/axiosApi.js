import axios from 'axios';
import CONSTANTS from "../constants";
import history from '../BrowserHistory';
import io from 'socket.io-client';
import store from '../store';
import { getTaskRequest } from '../actions/actionCreator';

const instance = axios.create({
    baseURL: `http://${CONSTANTS.API_BASE}`
});

const socket = io(`ws://${CONSTANTS.IPv4_ADDRESS}:5000`, { transports: ["websocket"] });

socket.on(CONSTANTS.SOCKET_EVENT_NOTIFICATION, (data) => {
    console.log(data);
    store.dispatch({
        type: 'NOTIFICATION',
        data
    })
});

socket.on(CONSTANTS.SOCKET_REFRESH_TASK_LIST, (data) => {
    store.dispatch(getTaskRequest());
})

// USER API

export const registerUser = async (userData) => await instance.post('/users/sign-up', userData);

export const loginUser = async (userData) => await instance.post('/users/sign-in', userData);

export const authUser = async () => await instance.get('/users/');

export const logOut = async() => {
    localStorage.clear(); // !!!!!!!!!
}

// INTERCEPTORS

instance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken');
    if(accessToken) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${accessToken}`
        }
    }
    return config;
}, (err) => Promise.reject(err));


instance.interceptors.response.use((response) => {
    if(response.data.tokens) {
        const {data: {tokens}} = response;
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
    }
    return response;
}, async (err) => {
    if(err.response.status === 403 && localStorage.getItem('refreshToken')) {
        await refreshUser();
        
        // Викликати заново функцію, на якій сталася помилка, після отримання токену
        return await instance(err.config);
    } else if(err.response.status === 401) {
        logOut();
        history.replace('/');
    } else {
        return Promise.reject(err);
    }

    return Promise.reject(err);
});

export const refreshUser = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const { data } = await instance.post('/users/refresh', {refreshToken});
    return data;
}

// TASK API

export const getTask = async () => await instance.get('/tasks/');

export const createTask = async (taskData) => await instance.post('/tasks', taskData);

export const deleteTask = async (taskId) => await instance.delete(`/tasks/${taskId}`);