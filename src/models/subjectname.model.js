import mongoose from "mongoose";

const subjectnameSchema = new mongoose.Schema({
    subjectname: {
        type: String,
        required: [true, "Subject name is must"],
        unique: true,
        trim: true,
    },
    topics: {
        type: [String],
    }
});

export const SubjectName = mongoose.model("SubjectName", subjectnameSchema);