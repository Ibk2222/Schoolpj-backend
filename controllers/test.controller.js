const testModel = require('../models/test.model');
const studentsModel = require('../models/students.model');
const teachersModel = require('../models/teachers.model');
const express = require("express");
const app = express();

const mongoose = require("mongoose");

const createTestPage = async (req, res) => {
  try {
    const [students, teachers, exams] = await Promise.all([
      studentsModel.find({}, 'firstname lastname _id'),
      teachersModel.find({}, 'firstname lastname _id'),
      testModel.find({}, 'grade_level start_date _id'),
    ]);
    res.render("addtests", { students, teachers, exams });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error loading form data");
  }
};

const getAllTests = (req, res) => {
  testModel
    .find()
    .populate('teacher_id', 'firstname lastname')
    .populate('subject_id', 'subject_name')
    .then((tests) => res.send({ status: true, tests }))
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: false, message: 'Error fetching tests' })
    })
}

const getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).populate('student').populate('exam').populate('teacher');
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTest = (req, res) => {
  const form = new testModel(req.body)
  form.save()
    .then(() => res.send({ status: true, message: 'Test added successfully' }))
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: false, message: error.message ?? 'Error adding test' })
    })
}

const updateTest = (req, res) => {
  const testId = req.params.id
  testModel.findByIdAndUpdate(testId, req.body, { new: true })
    .then(() => res.send({ status: true, message: 'Test updated' }))
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: false, message: 'Error updating test' })
    })
}
const editTest = (req, res) =>{
    const testId = req.params.id
      testModel
        .findById(testId)
        .then((result) => {
          res.render("edittest", { result });
          console.log(result);
        })
        .catch((error) => {
          console.log("There is an error");
          console.log(error);
          res.status(500).send("Error loading test data");
        });
}

const deleteTest = (req, res) => {
  const testId = req.params.id
  if (!mongoose.Types.ObjectId.isValid(testId)) return res.status(400).send({ status: false, message: 'Invalid test id' })
  testModel.findByIdAndDelete(testId)
    .then(() => res.send({ status: true, message: 'Test deleted' }))
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: false, message: 'Error deleting test' })
    })
};

module.exports = {
  createTestPage,
  getAllTests,
  getTestById,
  createTest,
  updateTest,
  editTest,
  deleteTest  
};