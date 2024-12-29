const jwt = require('jsonwebtoken');
const RefreshTokenModel = require('../Models/authTokenSchema');
const dotenv = require('dotenv');

const { REFRESH_TOKEN_SECRET, ACCESS_TOKEN_SECRET } = require('../config/env');

dotenv.config();

const RefreshTokenSecret = REFRESH_TOKEN_SECRET;
const AccessTokenSecret = ACCESS_TOKEN_SECRET;

class JWTService {
    static signAccessToken(payload, expiryTime) {
        return jwt.sign(payload, AccessTokenSecret, { expiresIn: expiryTime });
    }
    static signRefreshToken(payload, expiryTime) {
        return jwt.sign(payload, RefreshTokenSecret, { expiresIn: expiryTime });
    }

    static verifyAccessToken(token) {
        try {
            return jwt.verify(token, AccessTokenSecret);
        } catch (error) {
            throw new Error('Invalid access token');
        }
    }
    static verifyRefreshToken(token) {
        try {
            return jwt.verify(token, RefreshTokenSecret);
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
    static async storeRefreshToken(token, userId) {
        try {
            const existingToken = await RefreshTokenModel.findOne({ userId });
            if (existingToken) {
                existingToken.token = token;
                await existingToken.save();
            } else {
                const newToken = new RefreshTokenModel({
                    token: token,
                    userId: userId
                });
                await newToken.save();
            }
        } catch (error) {
            console.error('Error storing refresh token:', error);
        }
    }
}

module.exports = JWTService;