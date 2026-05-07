const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//exam Schema
const examsSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "students",
      required: true
    },
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subjects",
      required: true
    },
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teachers",
      required: true
    },
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "classes",
      required: true
    },
    score: {
      type: Number,
      required: true
    },

    max_score: {
      type: Number,
      required: true
    },
    passing_score: {
      type: Number,
      required: true
    },

     is_active: { type: Boolean, default: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
  },
  { timestamps: true }
);

const examsModel = mongoose.model("exams", examsSchema);
module.exports = examsModel;