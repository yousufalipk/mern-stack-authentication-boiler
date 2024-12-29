const UserModel = require('../Models/userSchema');
const RefreshTokenModel = require("../Models/authTokenSchema");
const bcrypt = require('bcrypt');
const JWTService = require('../Services/jwt');

exports.createUser = async (req, res) => {
    try {
        const { fname, lname, email, password, confirmPassword } = req.body;

        const alreadyUser = await UserModel.findOne({ email: email });

        if (alreadyUser) {
            return res.status(200).json({
                status: 'failed',
                message: "Account Already Created!"
            })
        }

        if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'failed',
                message: "Password did't match!"
            })
        }

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new UserModel({
            fname: fname,
            lname: lname,
            email: email,
            password: hashedPassword
        })

        let accessToken, refreshToken;

        accessToken = JWTService.signAccessToken({ _id: newUser._id, email: newUser.email }, '30m');
        refreshToken = JWTService.signRefreshToken({ _id: newUser._id }, '60m');

        const newRefreshToken = new RefreshTokenModel({
            token: refreshToken,
            userId: newUser._id
        })

        await newRefreshToken.save();

        await newUser.save();

        return res.status(200).json({
            status: 'success',
            user: newUser,
            auth: true,
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    } catch (error) {
        console.log("Error", error);
        return res.status(200).json({
            status: 'failed',
            message: 'Internal Server Error'
        })
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return res.status(200).json({
                status: 'failed',
                message: 'User not found!'
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(200).json({
                status: 'failed',
                message: 'Invalid Password'
            });
        }

        let accessToken = JWTService.signAccessToken({ _id: user._id, email: user.email }, '30m');
        let refreshToken = JWTService.signRefreshToken({ _id: user._id }, '60m');

        await RefreshTokenModel.updateOne(
            { userId: user._id },
            { $set: { token: refreshToken } },
            { upsert: true }
        );

        return res.status(200).json({
            status: 'success',
            user: user,
            auth: true,
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            status: 'failed',
            message: 'Internal Server Error!'
        });
    }
};

exports.logOutUser = async (req, res) => {
    try {

        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(200).json({
                status: 'failed',
                message: 'Refresh Token not found!'
            })
        }

        const deleteRefreshToken = await RefreshTokenModel.deleteOne({ token: refreshToken });

        if (!deleteRefreshToken) {
            return res.status(200).json({
                status: 'failed',
                message: 'Error Logging Out!'
            })
        }

        // Response
        return res.status(200).json({
            status: 'success',
            user: null,
            auth: false
        });
    } catch (error) {
        console.log("Error: ", error);
        return res.status(500).json({
            status: 'failed',
            message: 'Internal Server Error'
        });
    }
}

exports.refresh = async (req, res) => {
    const { originalRefreshToken } = req.body;

    if (!originalRefreshToken) {
        return res.status(200).json({
            status: 'failed',
            message: 'Refresh token is missing',
            auth: false
        });
    }

    let id;
    try {
        const decoded = JWTService.verifyRefreshToken(originalRefreshToken);
        id = decoded._id;
    } catch (e) {
        console.error('Token verification failed:', e.message);
        return res.status(200).json({
            status: 'failed',
            message: 'Token verification failed'
        });
    }

    try {
        const match = await RefreshTokenModel.findOne({ userId: id, token: originalRefreshToken });
        if (!match) {
            return res.status(200).json({
                status: 'failed',
                message: 'Unauthorized'
            });
        }

        const accessToken = JWTService.signAccessToken({ _id: id }, "30m");
        const refreshToken = JWTService.signRefreshToken({ _id: id }, "60m");

        await JWTService.storeRefreshToken(refreshToken, id);

        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(200).json({
                status: 'failed',
                message: 'User not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            user: user,
            auth: true,
            accessToken: accessToken,
            refreshToken: refreshToken
        });

    } catch (error) {
        console.error('Error', error);
        return res.status(500).json({
            status: 'failed',
            message: 'Internal Server Error'
        });
    }
}