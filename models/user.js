const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cryptoJs = require("crypto-js");
const validator = require("validator");
const dotenv = require("dotenv");
dotenv.config({ path: "../../config.env" });
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            minLenght: [3, "name should be more than 2 characters long"],
            maxlength: [20, "name should be less than 20 characters"],
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [validator.isEmail, "please provide valid email"],
        },
        password: {
            type: String,
            required: true,
            minLength: [6, "password should be atleast 6 characters long"],
        },
        bookmarks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
                default: [],
            },
        ],
        isAdmin: {
            type: Boolean,
            default: false,
        },
        posts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Post",
                default: [],
            },
        ],
        preferences: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category",
                default: [],
            },
        ],
        bio: String,
        websiteURL: String,
        image: String,
        isVerified: Boolean,
        location: String,
        work: String,
        education: String,
        passwordResetToken: String,
        passwordResetExpiry: Date,
        newsletter: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// userSchema.pre(/^find/, async function (next) {
//     this.populate({
//         path: "bookmarks",
//     })
//         // .populate({
//         //     path: "posts",
//         // })
//         // .populate({
//         //     path: "preferences",
//         // });
//     next();
// });

userSchema.pre("save", async function (next) {
    (this.password = cryptoJs.AES.encrypt(
        this.password,
        "sachin1234"
    ).toString()),
        next();
});

userSchema.methods.comparePasswords = async (userPassword, requestPassword) => {
    const hastPassword = cryptoJs.AES.decrypt(userPassword, "sachin1234");

    const password = hastPassword.toString(cryptoJs.enc.Utf8);
    return password === requestPassword;
};

userSchema.methods.createPasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = resetToken;
    this.passwordResetExpiry = Date.now() + 10 * 1000 * 60;
    return resetToken;
};

userSchema.methods.createTokens = async (user) => {
    //* access token
    const token = jwt.sign(
        {
            id: user._id,
            isAdmin: user.isAdmin,
        },
        "sachin1234",
        {
            expiresIn: 60 * 60 * 24 * 7 * 1000,
        }
    );
    //* refresh token
    const refreshToken = jwt.sign({ id: user._id }, "sachin1234", {
        expiresIn: "7d",
    });
    return { token, refreshToken };
};

const User = mongoose.model("User", userSchema);
module.exports = User;
