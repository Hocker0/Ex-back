import mongoose from "mongoose";

const givenpaperSchema = new mongoose.Schema({
    questionid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
    },
    useranswer: {
        type: String,
        default: "",
    },
    timetaken: {
        type: Number,
        default: 0,
    }
})

const responseSchema = new mongoose.Schema({
    givenpaper: [givenpaperSchema],
});

export const Response = mongoose.model("Response", responseSchema);