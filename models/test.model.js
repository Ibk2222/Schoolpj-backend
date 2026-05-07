const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//Test Schema
const testSchema = new mongoose.Schema(
  {
    test_name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teachers",
      required: true
    },
    test_score: {
      type: Number,
      min: 0,
      max: 100
    },
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subjects",
      required: true
    },
    is_active: { type: Boolean, default: true }
  },
  { timestamps: true }
);  
const testModel = mongoose.model("tests", testSchema);
module.exports = testModel;