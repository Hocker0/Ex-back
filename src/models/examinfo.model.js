import mongoose from "mongoose";

const markingSchema = new mongoose.Schema({
    subjectname: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubjectName",
    },
    noofquestions: {
        type: Number,
        default: 0,
        min: 0,
    },
    posmarks: {
        type: Number,
        min: 0,
    },
    negmarks: {
        type: Number,
        default: 0,
        min: 0
    }
})

const examinfoSchema = new mongoose.Schema({
    examname: {
        type: String,
        required: [true, "ExamName is must"],
        unique: true,
        uppercase: true,
        trim: true,
    },
    duration:
    {
        type: Number,
        required: [true, "Enter test duration"],
    },
    markingschema: [markingSchema],
});

export const ExamInfo = mongoose.model("ExamInfo", examinfoSchema);