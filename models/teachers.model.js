const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


//Teacher Schema
// const teacherSchema = mongoose.Schema({
//   firstname: { type: String, required: true },
//   lastname: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   age: { type: Number, required: true },
//   password: { type: String, required: true },
//   phone: { type: Number, required: true },
//   joined_in : { type: String, required: true },
//   role: { type: String, default: "teacher" , enum: ["teacher", "admin"] },
// });
const teacherSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    firstname: {
      type: String,
      required: true,
      trim: true,
      match: [/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/, "Invalid first name format"]
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      match: [/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/, "Invalid last name format"]
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"]
    },
    age: { type: Number, required: true, min: 18 },
    password: {
      type: String,
      required: true,
      minlength: 6,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
        "Password must contain uppercase, lowercase, and number"
      ]
    },
    is_active: { type: Boolean, default: true },
    phone: {type: String,required: true, trim: true, match: [/^\+?[0-9]{10,15}$/, "Invalid phone number format"]
  },
    joined_in: {
      type: Date,
      required: true,
      default: Date.now
    },
    role: {
      type: String,
      enum: ["teacher", "admin"],
      default: "teacher"
    },
    approval_status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    resetCode: { type: String, default: null },
    resetCodeExpiry: { type: Date, default: null },
    lastSeen: { type: Date, default: null },
  },
  { timestamps: true }
);

let saltRound = 10;

teacherSchema.pre("save", function () {
  if (!this.isModified("password")) return;

  return bcrypt.hash(this.password, saltRound)
    .then((hashedPassword) => {
      this.password = hashedPassword;
    })
    .catch((err) => {
      console.log(err, "password could not be hashed");
      throw err; // ❗ important
    });
});

teacherSchema.methods.validatePassword = function (password, callback) {
  console.log(password, this.password);

  bcrypt.compare(password, this.password, (err, same) => {
    console.log(same);
    callback(err, same);
  });
};

//Teacher Model
const teacherModel = mongoose.model("teachers", teacherSchema);

module.exports = teacherModel;