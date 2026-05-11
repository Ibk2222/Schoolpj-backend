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
const studentsSchema = new mongoose.Schema(
  {
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
    age: { type: Number, required: false, min: 5, max: 12 },
    password: {
      type: String,
      required: true,
      minlength: 6,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
        "Password must contain uppercase, lowercase, and number"
      ]
    },
    class_id: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "classes",
      required: true
    },  

    image: { type: String, default: '' },
      dob: { type: Date, required: true, min: new Date('2017-01-01'), max: new Date('2022-12-31') },
      gender: { type: String, required: true, enum: ["male", "female"] },
      address: { type: String, required: true },
      is_active: { type: Boolean, default: true },
parent_phone: { type: String, required: true, trim: true, match: [/^[0-9]{11}$/, "Phone number must be exactly 11 digits"] },
    role: {
      type: String,
      enum: ["student"],
      default: "student"
    },
    resetCode: { type: String, default: null },
    resetCodeExpiry: { type: Date, default: null },
    lastSeen: { type: Date, default: null },
  });

let saltRound = 10;

studentsSchema.pre("save", function () {
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

studentsSchema.methods.validatePassword = function (password, callback) {
  console.log(password, this.password);

  bcrypt.compare(password, this.password, (err, same) => {
    console.log(same);
    callback(err, same);
  });
};

//Student Model
const studentsModel = mongoose.model("students", studentsSchema);

module.exports = studentsModel;