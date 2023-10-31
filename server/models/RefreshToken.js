const mongoose = require('mongoose');
const { Schema } = mongoose;

/* refreshTokens

- userId
- token
- createdAt
- fingerPrint

*/

const refreshTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    fingerPrint: {
        type: String
    }
});
// we can add info about devices

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

module.exports = RefreshToken;