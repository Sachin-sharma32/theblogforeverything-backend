const User = require("../models/user");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Bookmark = require("../models/bookmark");
const Like = require("../models/like");
const sendEmail = require("../utils/email");

exports.createUser = catchAsync(async (req, res) => {
    const newUser = await User.create(req.body);
    await Bookmark.create({ userId: newUser._id, posts: [] });
    res.status(200).json({
        message: "success",
        data: {
            newUser,
        },
    });
});

exports.logIn = catchAsync(async (req, res, next) => {
    if (!req.body.oAuth) {
        const user = await User.findOne({
            email: req.body.email,
        });

        if (!user) {
            return next(new AppError("user not found", 404));
        }

        if (!user.comparePasswords(user.password, req.body.password)) {
            return new next(AppError("incorrect password", 401));
        } else {
            const { token, refreshToken } = await user.createTokens(user);
            // res.cookie("jwt", refreshToken, {
            //     httpOnly: true,
            //     // secure: true, // https
            //     // sameSite: "none", // to access on different IP
            //     maxAge: 7 * 24 * 60 * 60 * 1000,
            // });
            res.status(200).json({
                message: "success",
                data: {
                    user,
                    token,
                    // refreshToken,
                },
            });
        }
    } else if (req.body.oAuth) {
        let user = await User.findOne({
            email: req.body.email,
        });

        if (!user) {
            user = await User.collection.insertOne(req.body);
            await Bookmark.create({ userId: user.insertedId, posts: [] });
            await Like.create({ userId: user.insertedId, posts: [] });
            user = await User.findOne({
                _id: user.insertedId,
            });
        }

        const { token, refreshToken } = await user.createTokens(user);
        res.cookie("jwt", refreshToken, {
            httpOnly: true,
        });
        res.status(200).json({
            message: "success",
            token: token,
        });
    }
});

exports.logOut = catchAsync(async (req, res) => {
    const cookies = await req.cookies;
    if (!cookies.jwt) return res.sendStatus(204);
    res.clearCookie("jwt", { httpOnly: true });
    res.status(200).json({
        status: "success",
        message: "cookie cleared",
    });
});

//* when access token expires
exports.refresh = catchAsync(async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies.jwt) return next(new AppError("unauthorised", 401));
    const refreshToken = cookies.jwt;
    //* verify token
    const decoded = jwt.verify(refreshToken, "sachin1234");
    const foundUser = await User.findOne({ _id: decoded.id });
    if (!foundUser) return next(new AppError("unauthorised", 401));
    //* new access token
    const { token } = await foundUser.createTokens(foundUser);
    res.status(200).json({
        message: "success",
        token: token,
    });
});

//? 4 - very important
exports.verifyToken = (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization) {
        const authToken = authorization.split(" ")[1];
        jwt.verify(authToken, "sachin1234", (err, user) => {
            if (err) {
                return next(new AppError("incorrect jwt", 401));
            } else {
                req.user = user;
                next();
            }
        });
    } else {
        return next(new AppError("jwt not provided", 401));
    }
};
exports.verifyAdmin = (req, res, next) => {
    const { authorization } = req.headers;
    if (authorization) {
        const authToken = authorization.split(" ")[1];
        jwt.verify(authToken, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return next(new AppError("incorrect jwt", 401));
            } else {
                if (user.isAdmin) {
                    next();
                } else {
                    return next(
                        new AppError("only admin can perform this action", 401)
                    );
                }
            }
        });
    } else {
        return next(new AppError("jwt not provided", 401));
    }
};

exports.verifyUser = (req, res, next) => {
    this.verifyToken(req, res, () => {
        const { id } = req.params;
        if (req.user.id === id || req.user.isAdmin) {
            next();
        } else {
            return next(
                new AppError(
                    "only the account owner or admin can perform this action",
                    401
                )
            );
        }
    });
};

exports.forgetPassword = catchAsync(async (req, res, next) => {
    const email = req.body.email;
    const user = await User.findOne({ email: { $in: [email] } });
    if (!user) {
        return next(new AppError("User don't exist", 404));
    }
    const resetToken = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${req.protocol}://localhost:3000/resetPassword/${resetToken}`;
    const message = `Visit this link ${resetUrl} to reset your password. If you havn't forget your password then ignore this mail.`;
    await sendEmail({
        email: user.email,
        subject: "password reset link (valid for 10 min)",
        message: message,
    });
    res.status(200).json({
        message: "success",
        message: "password reset link sent successfully",
    });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const { resetToken } = req.params;
    const user = await User.findOne({
        passwordResetToken: resetToken,
        passwordResetExpiry: { $gt: new Date(Date.now()) },
    });
    if (!user) {
        return next(new AppError("token is incorrect or was expired", 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;
    await user.save();
    res.status(200).json({
        status: "success",
        message: "password reset successfully",
    });
});
