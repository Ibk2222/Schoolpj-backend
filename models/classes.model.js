const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const classesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teachers",
      required: true
    },
   academic_year: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{4}$/, "Academic year must be in format YYYY-YYYY"]
    },
     is_active: { type: Boolean, default: true },
    subject: { type: String, default: '' },
    room: { type: String, default: '' },
    schedule: {
      days: [String],
      time: { type: Date, required: true }
    },

  },
  { timestamps: true }
);
const classesModel = mongoose.model("classes", classesSchema);
module.exports = classesModel;

