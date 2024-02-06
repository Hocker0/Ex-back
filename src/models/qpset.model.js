import mongoose from "mongoose";

const qpsetSchema = new mongoose.Schema({
    qpname: {
        type: String,
        required: [true, "QPName is must"],
        unique: true,
        uppercase: true,
        trim: true,
    },
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
        },
    ],
    paperprice: {
        type: Number,
        default: 0,
        min: 0,
    },
    examinfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExamInfo",
    }
}, {
    timestamps: true,
});

export const QPSet = mongoose.model("QPSet", qpsetSchema);