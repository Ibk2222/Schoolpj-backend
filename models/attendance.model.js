const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { resolveInclude } = require("ejs");

//Attendance Schema
const attendanceSchema = new mongoose.Schema(
  { 
    class_id: { type: mongoose.Schema.Types.ObjectId, ref: "classes", required: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "students", required: true },
    // teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "teachers", required: true },
    date: { type: Date, required: true },
    marked_by: { type: mongoose.Schema.Types.ObjectId, ref: "teachers", required: true },
    status: { type: String, enum: ["present", "absent"], required: true },
    is_active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const attendanceModel = mongoose.model("attendance", attendanceSchema);
module.exports = attendanceModel;