const timetablesModel = require('../models/timetables.model');
const express = require("express");
const app = express();

const mongoose = require("mongoose");

const getAllTimetables = (req, res) => {
  timetablesModel
    .find()
    .populate('class', 'name')
    .populate('teacher', 'firstname lastname')
    .populate('subject', 'subject_name')
    .then((timetables) => res.send({ status: true, timetables }))
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: false, message: 'Error fetching timetables' })
    })
}

const getTimetableById = async (req, res) => {
  try {
    const timetables = await timetablesModel.findById(req.params.id);
    if (!timetables) {
      return res.status(404).json({ message: 'Timetable not found' });
    }
    res.status(200).json(timetables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTimetable = (req, res) => {
  const form = new timetablesModel(req.body)
  form.save()
    .then(() => res.send({ status: true, message: 'Timetable added successfully' }))
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: false, message: error.message ?? 'Error adding timetable' })
    })
}

const updateTimetable = (req, res) => {
  const timetablesId = req.params.id
  timetablesModel.findByIdAndUpdate(timetablesId, req.body, { new: true })
    .then(() => res.send({ status: true, message: 'Timetable updated' }))
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: false, message: 'Error updating timetable' })
    })
}
const editTimetable = (req, res) =>{
    const timetablesId = req.params.id
      timetablesModel
        .findById(timetablesId)
        .then((result) => {
          res.render("edittimetable", { result });
          console.log(result);
        })
        .catch((error) => {
          console.log("There is an error");
          console.log(error);
          res.status(500).send("Error loading timetables  data");
        });
}

const deleteTimetable = (req, res) => {
  const timetablesId = req.params.id
  if (!mongoose.Types.ObjectId.isValid(timetablesId)) return res.status(400).send({ status: false, message: 'Invalid timetable id' })
  timetablesModel.findByIdAndDelete(timetablesId)
    .then(() => res.send({ status: true, message: 'Timetable deleted' }))
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: false, message: 'Error deleting timetable' })
    })
};

module.exports = {
  getAllTimetables,
  getTimetableById,
  createTimetable,
  updateTimetable,
  editTimetable,
  deleteTimetable
};