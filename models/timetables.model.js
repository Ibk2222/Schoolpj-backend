const mongoose = require("mongoose");

// Timetable Schema
const timetablesSchema = new mongoose.Schema(
  {
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "classes",
      required: true
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teachers",
      required: true
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subjects",
      required: true
    },
    day_of_week: {
      type: String,
      required: true,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    },
    start_time: {
      type: String,
      required: true,
      match: [/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/, "Start time must be in HH:MM format (24-hour)"]
    },
    end_time: {
      type: String,
      required: true,
      match: [/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/, "End time must be in HH:MM format (24-hour)"]
    },

    academic_year: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{4}$/, "Academic year must be in format YYYY-YYYY"]
    },
    is_active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Validate that end_time is after start_time
timetablesSchema.pre("save", function (next) {
  if (this.start_time >= this.end_time) {
    return next(new Error("End time must be after start time"));
  }
  next();
});

// Timetable Model
const timetablesModel = mongoose.model("timetables", timetablesSchema);

module.exports = timetablesModel;
