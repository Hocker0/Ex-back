import mongoose from "mongoose";
import validator from 'validator';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is Must."],
        lowercase: true,
        unique: true,
        trim: true,
        minlength: [5, "Username must be at least 5 characters long."],
        maxlength: [12, "Username cannot be this long."],
        validate: [
            validator.isAlphanumeric,
            "Alphanumeric string is allowed.",
        ]
    },
    email: {
        type: String,
        required: [true, "Email is Must."],
        lowercase: true,
        unique: true,
        trim: true,
        validate: [
            validator.isEmail,
            "Invalid Email",
        ]
    },
    avatar: {
        type: Number,
        default: 1
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password is short"],
        // select: false,
    },
    category: {
        type: String,
        required: [true, "Category field is required."],
        enum: {
            values: ["OBC-NCL", "ST", "OBC-NCL (PwD)", "Gen-EWS", "Open", "Open (PwD)", "SC", "SC (PwD)", "Gen-EWS (PwD)"],
            message: "Please choose valid category option."
        }
    },
    elitecoin: {
        type: Number,
        default: 0
    },
    coingiven: {
        type: Boolean,
        default: true,
    },
    refreshtoken: {
        type: String,
    },
    generatedToken: {
        type: String
    },

    generatedTokenExpiry: {
        type: Date
    },

    isActive: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true,
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            avatar: this.avatar,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateOTP = function () {
    //generate token
    const token = crypto.randomBytes(3).toString('hex').toUpperCase();

    //encrypt the token
    this.generatedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    //set reset expiry
    this.generatedTokenExpiry = Date.now() + 10 * 60 * 1000;

    return token;
};

export const User = mongoose.model("User", userSchema);