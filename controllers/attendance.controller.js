const attendanceModel = require('../models/attendance.model');
const studentsModel = require('../models/students.model');
const teachersModel = require('../models/teachers.model');
const classesModel = require('../models/classes.model');
const adminModel = require('../models/admin.model');
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const createAttendancePage = async (req, res) => {
  try {
    const [students, teachers, classes, admins] = await Promise.all([
      studentsModel.find({}, 'firstname lastname _id'),
      teachersModel.find({}, 'firstname lastname _id'),
      classesModel.find({}, 'name academic_year _id'),
      adminModel.find({}, 'firstname lastname _id'),
    ]);
    const isTeacher = req.originalUrl.startsWith('/teacher');
    const formAction = isTeacher ? '/teacher/create-attendance' : '/admin/create-attendance';
    res.render("addattendance", { students, teachers, classes, admins, formAction });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error loading attendance form");
  }
};

const getAllAttendance = (req, res) => {
  attendanceModel
    .find()
    .populate('class_id', 'name')
    .populate('student_id', 'firstname lastname')
    .populate('marked_by', 'firstname lastname')
    .then((attendance) => res.send({ status: true, attendance }))
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: false, message: 'Error fetching attendance' })
    })
};

// const getAttendanceById =  (req, res) => {
//   try {
//     const attendance = await Attendance.findById(req.params.id).populate('student').populate('teacher').populate('marked_by');
//     if (!attendance) {
//       return res.status(404).json({ message: 'Attendance not found' });
//     }
//     res.status(200).json(attendance);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const createAttendance = (req, res) => {
  const form = new attendanceModel(req.body)
  form.save()
    .then(() => res.send({ status: true, message: 'Attendance recorded successfully' }))
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: false, message: error.message ?? 'Error adding attendance' })
    })
}

const updateAttendance = (req, res) => {
  const attendanceId = req.params.id
  attendanceModel.findByIdAndUpdate(attendanceId, req.body, { new: true })
    .then(() => res.send({ status: true, message: 'Attendance updated' }))
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: false, message: 'Error updating attendance' })
    })
}
const editAttendance = (req, res) => {
   const attendanceId = req.params.id;
    
      if (!mongoose.Types.ObjectId.isValid(attendanceId)) {
        return res.status(400).send({ status: false, message: "Invalid attendance id" });
      }
    
      attendanceModel
        .findById(attendanceId)
        .then((attendance) => {
          res.render("editattendance", { attendance });
          console.log(attendance);
        })
        .catch((error) => {
          console.log("There is an error");
          res.send("There is an error")
          console.log(error);
           res
        .status(500)
        .send({ status: false, message: "Error fetching attendance data" });
        });
}

const deleteAttendance = (req, res) => {
  const attendanceId = req.params.id
  if (!mongoose.Types.ObjectId.isValid(attendanceId)) return res.status(400).send({ status: false, message: 'Invalid attendance id' })
  attendanceModel.findByIdAndDelete(attendanceId)
    .then(() => res.send({ status: true, message: 'Attendance deleted' }))
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: false, message: 'Error deleting attendance' })
    })
};

module.exports = {
  createAttendancePage,
  getAllAttendance,
  editAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance
};