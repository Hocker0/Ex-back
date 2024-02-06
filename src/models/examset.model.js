import mongoose from "mongoose";

const attemptedSchema = new mongoose.Schema({
    subject: {
        type: String,
    },
    total: {
        type: Number,
    },
    correct: {
        type: Number,
    }
})

const examsetSchema = new mongoose.Schema({
    qpset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "QPSet",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    response: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Response",
    },
    attempted: [attemptedSchema],
    reward: {
        type: Number,
    },
}, {
    timestamps: true,
});

export const ExamSet = mongoose.model("ExamSet", examsetSchema);