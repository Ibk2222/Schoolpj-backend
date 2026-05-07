const mongoose = require("mongoose");


//Result Schema
const resultSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "students", required: true },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: "exams", required: true },
    score: { type: Number, required: true },
    grade_level: { type: String, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "teachers", required: true },
    is_active: { type: Boolean, default: true }
  }
);


const resultModel = mongoose.model("results", resultSchema);
module.exports = resultModel;