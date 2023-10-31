import axios from 'axios';
import CONSTANTS from "../constants";

const instance = axios.create({
    baseURL: `http://${CONSTANTS.API_BASE}`
});

export const authByQRCode = async(authData) => await instance.post('/users/authByQRCode', authData);

export default instance;