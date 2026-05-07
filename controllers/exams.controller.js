const examsModel = require('../models/exams.model');
const subjectModel = require('../models/subjects.model');
const teachersModel = require('../models/teachers.model');
const studentsModel = require('../models/students.model');
const express = require("express");
const app = express();

const mongoose = require("mongoose");

const classesModel = require('../models/classes.model');

const createExamPage = async (req, res) => {
  try {
    const [students, classes, subjects, teachers] = await Promise.all([
      studentsModel.find({}, 'firstname lastname _id'),
      classesModel.find({}, 'name academic_year _id'),
      subjectModel.find({}, 'subject_name _id'),
      teachersModel.find({}, 'firstname lastname _id'),
    ]);
    res.render("addexam", { students, classes, subjects, teachers });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error loading form data");
  }
};


const getAllExams = (req, res) => {
  examsModel.find()
    .populate('student_id', 'firstname lastname')
    .populate('subject_id', 'subject_name')
    .populate('teacher_id', 'firstname lastname')
    .populate('class_id', 'name')
    .then((exams) => res.send({ status: true, exams }))
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: false, message: 'Error fetching exams' })
    })
}

const getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('subject').populate('teacher');
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.status(200).json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createExam = (req, res) => {
  const form = new examsModel(req.body)
  form.save()
    .then(() => res.send({ status: true, message: 'Exam added successfully' }))
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: false, message: error.message ?? 'Error adding exam' })
    })
}

const updateExam = (req, res) => {
  const examId = req.params.id
  examsModel.findByIdAndUpdate(examId, req.body, { new: true })
    .then(() => res.send({ status: true, message: 'Exam updated' }))
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: false, message: 'Error updating exam' })
    })
}
const editExam = (req, res) =>{
    const examId = req.params.id
      examsModel
        .findById(examId)
        .then((exams) => {
          res.render("editexams", { exams });
          console.log(exam);
        })
        .catch((error) => {
          console.log("There is an error");
          console.log(error);
          res.status(500).send("Error loading exams data");
        });
}

const deleteExam = (req, res) => {
  const examId = req.params.id
  if (!mongoose.Types.ObjectId.isValid(examId)) return res.status(400).send({ status: false, message: 'Invalid exam id' })
  examsModel.findByIdAndDelete(examId)
    .then(() => res.send({ status: true, message: 'Exam deleted' }))
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: false, message: 'Error deleting exam' })
    })
};

module.exports = {
  createExamPage,
  getAllExams,
  getExamById,
  createExam,
  editExam,
  updateExam,
  deleteExam
};