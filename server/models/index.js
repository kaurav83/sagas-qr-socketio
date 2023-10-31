const mongoose = require('mongoose');
const User = require('./User');
const Task = require('./Task');
const RefreshToken = require('./RefreshToken');
const DB_CONFIG = require('../configs/db');
const env = process.env.NODE_ENV || 'development';
const dbConfig = env === 'development' ? DB_CONFIG.development : env === 'test' ? DB_CONFIG.test : null;

mongoose.connect(dbConfig.DB)
.catch(err => {
    console.log('connect failed');
    process.exit(1);
})

module.exports = {
    User, Task, RefreshToken
}