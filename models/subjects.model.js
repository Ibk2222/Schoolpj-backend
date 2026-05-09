const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


//Subject Schema
const subjectSchema = new mongoose.Schema(
  {
    subject_name: {
      type: String,
      required: true,
      trim: true
    },
    classes_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "classes",
      required: true
    },
    teachers_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teachers",
      required: true
    },
    is_active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const subjectModel = mongoose.model("subjects", subjectSchema);

module.exports = subjectModel;