const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: (v) => /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(v)
        }
    },
    passwordHash: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        validate: {
            validator: (v) => v < new Date()
        }
    }
})

const User = mongoose.model('User', userSchema);

module.exports = User;