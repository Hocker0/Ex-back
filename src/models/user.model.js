import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is Must."],
        lowercase: true,
        unique: true,
        trim: true,
        minlength: [5, "username not less then 5 caracters"],
        maxlength: [12, "username not more than 12 characters"],
        validate: [
            validator.isAlphanumeric,
            "Alphanumeric string is allowed"
        ]
    },

    email: {
        type: String,
        required: [true, "Username is Must"],
        lowercase: true,
        unique: true,
        trim: true,
        validate: [
            validator.isEmail,
            "invalid Email"
        ]
    },

    avtar: {
        type: Number,
        default: 1
    },

    password: {
        type: String,
        required: true,
        minlength: [8,"password is short"]
    },

    category: {
        type: String,
        required: [true, "category field is required"],
        enum:{
            values:["OBC-NCL","ST","SC","OBC-NCL (PWD)","GEN-EWS","OPEN","OPEN (PWD)","SC","SC (PWD)","GEN-EWS (PWD)"],
            message: "please choose valid category option."
        }
    },

    elitecoin: {
        type: Number,
        default: 0
    },

    coingiven
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);