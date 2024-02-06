import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    subjectname: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subjectName",
    },
    topic: [
        {
            type: String,
            lowercase: true,
            trim: true,
        }
    ],
    txtquestion: {
        type: String,
        trim: true,
    },
    imgquestion: {
        type: String,
        trim: true,
    },
    options: [
        {
            type: String,
            trim: true,
        }
    ],
    correctanswer: {
        type: String,
        required: [true, "Type the correct answer"],
        trim: true,
    },
    complexity: {
        type: Number,
        required: [true, "Please define complexity"],
        enum: {
            values: [1, 2, 3]
        }
    },
    explanation: {
        type: String,
        trim: true,
    },
});

export const Question = mongoose.model("Question", questionSchema);