const resultModel = require('../models/result.model');
const studentsModel = require('../models/students.model');
const teachersModel = require('../models/teachers.model');
const examsModel = require('../models/exams.model');
const express = require("express");
const app = express();

const mongoose = require("mongoose");

const createResultPage = async (req, res) => {
  try {
    const [students, teachers, exams] = await Promise.all([
      studentsModel.find({}, 'firstname lastname _id'),
      teachersModel.find({}, 'firstname lastname _id'),
      examsModel.find({}, 'grade_level start_date _id'),
    ]);
    res.render("addresults", { students, teachers, exams });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error loading form data");
  }
};

const getAllResults = (req, res) => {
  resultModel
    .find()
    .populate('student', 'firstname lastname email image dob')
    .populate('teacher', 'firstname lastname')
    .populate({
      path: 'exam',
      select: 'score max_score start_date subject_id',
      populate: { path: 'subject_id', select: 'subject_name' }
    })
    .then((results) => res.send({ status: true, results }))
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: false, message: 'Error fetching results' })
    })
}

const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id).populate('student').populate('exam').populate('teacher');
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createResult = (req, res) => {
  const form = new resultModel(req.body)
  form.save()
    .then(() => res.send({ status: true, message: 'Result added successfully' }))
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: false, message: error.message ?? 'Error adding result' })
    })
}

const updateResult = (req, res) => {
  const resultId = req.params.id
  resultModel.findByIdAndUpdate(resultId, req.body, { new: true })
    .then(() => res.send({ status: true, message: 'Result updated' }))
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: false, message: 'Error updating result' })
    })
}
const editResult = (req, res) =>{
    const resultId = req.params.id
      resultModel
        .findById(resultId)
        .then((result) => {
          res.render("editresult", { result });
          console.log(result);
        })
        .catch((error) => {
          console.log("There is an error");
          console.log(error);
          res.status(500).send("Error loading result data");
        });
}

const deleteResult = (req, res) => {
  const resultId = req.params.id
  if (!mongoose.Types.ObjectId.isValid(resultId)) return res.status(400).send({ status: false, message: 'Invalid result id' })
  resultModel.findByIdAndDelete(resultId)
    .then(() => res.send({ status: true, message: 'Result deleted' }))
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: false, message: 'Error deleting result' })
    })
};

module.exports = {
  createResultPage,
  getAllResults,
  getResultById,
  createResult,
  updateResult,
  editResult,
  deleteResult
};