const mongoose = require('mongoose');

const authTokensSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const AuthToken = mongoose.model('AuthToken', authTokensSchema);

module.exports = AuthToken;