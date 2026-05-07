const subjectModel = require('../models/subjects.model');
const classesModel = require('../models/classes.model');
const teachersModel = require('../models/teachers.model');
const express = require("express");
const app = express();

const mongoose = require("mongoose");

const createSubjectPage = async (req, res) => {
  try {
    const [classes, teachers] = await Promise.all([
      classesModel.find({}, 'name academic_year _id'),
      teachersModel.find({}, 'firstname lastname _id'),
    ]);
    const isTeacher = req.originalUrl.startsWith('/teacher');
    const formAction = isTeacher ? '/teacher/create-subject' : '/admin/create-subject';
    res.render("addsubject", { classes, teachers, formAction });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error loading form data");
  }
};
const manageSubjectPage = async (req, res) => {
  try {
    const subjects = await subjectModel.find()
      .populate('teachers_id', 'firstname lastname')
      .populate({
        path: 'classes_id',
        select: 'name academic_year student_id',
        populate: { path: 'student_id', select: 'firstname lastname' }
      });
    const isTeacher = req.originalUrl.startsWith('/teacher');
    const prefix = isTeacher ? '/teacher' : '/admin';
    res.render("managesubject", { subjects, prefix });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error loading subjects");
  }
};

// Get all subjects
const getAllSubjects = (req, res) =>{
     subjectModel
        .find()
        .populate('teachers_id', 'firstname lastname')
        .populate('classes_id', 'name')
        .then((subjects) => {
          res.send({ status: true, subjects });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send({ status: false, message: "Error fetching subjects" });
        });
}
// const getAllSubjects = async (req, res) => {
//   try {
//     const subjects = await subjectModel.find().populate('teacher');
//     res.status(200).json(subjects);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Get subject by ID
// const getSubjectById = async (req, res) => {
//   try {
//     const subject = await subjectModel.findById(req.params.id).populate('teacher');
//     if (!subject) {
//       return res.status(404).json({ message: 'Subject not found' });
//     }
//     res.status(200).json(subject);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Create a new subject
// const createSubject = async (req, res) => {
//   try {
//     const { name, teacher } = req.body;
//     const newSubject = new subjectModel({ name, teacher });
//     const savedSubject = await newSubject.save();
//     res.status(201).json(savedSubject);
//   } catch (error) {
//     if (error.code === 11000) {
//       res.status(400).json({ message: 'Subject name must be unique' });
//     } else {
//       res.status(500).json({ message: error.message });
//     }
//   }
// };
const createSubject = async (req, res) => {
  try {
    const { subject_name, classes_id, teachers_id, is_active } = req.body;
    const names = Array.isArray(subject_name) ? subject_name : [subject_name];
    const docs = names.map(name => ({ subject_name: name, classes_id, teachers_id, is_active }));
    await subjectModel.insertMany(docs, { ordered: false });
    res.send({ status: true, message: "Subject added successfully" });
  } catch (error) {
    console.log(error);
    const message = error.errors
      ? Object.values(error.errors)[0].message
      : error.message ?? "Error saving subjects";
    res.status(500).send({ status: false, message });
  }
};

// Update a subject
// const updateSubject = async (req, res) => {
//   try {
//     const { name, teacher, is_active } = req.body;
//     const updatedSubject = await subjectModel.findByIdAndUpdate(
//       req.params.id,
//       { name, teacher, is_active },
//       { new: true, runValidators: true }
//     ).populate('teacher');
//     if (!updatedSubject) {
//       return res.status(404).json({ message: 'Subject not found' });
//     }
//     res.status(200).json(updatedSubject);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const updateSubject = (req, res) =>{
    const subjectId = req.params.id

      subjectModel.findByIdAndUpdate(subjectId, req.body, { new: true })
      .then(()=>{
        res.send({ status: true, message: "Subject updated successfully" });
      })
      .catch((error)=>{
        console.log(error)
        res.status(500).send({ status: false, message: "Error updating subject" });
      })
}
const editSubject = (req, res) =>{
    const subjectId = req.params.id
      subjectModel
        .findById(subjectId)
        .then((subject) => {
          res.render("editSubject", { subject });
          console.log(subject);
        })
        .catch((error) => {
          console.log("There is an error");
          console.log(error);
          res.status(500).send("Error loading subject data");
        });
}


// Delete a subject
// const deleteSubject = async (req, res) => {
//   try {
//     const deletedSubject = await subjectModel.findByIdAndDelete(req.params.id);
//     if (!deletedSubject) {
//       return res.status(404).json({ message: 'Subject not found' });
//     }
//     res.status(200).json({ message: 'Subject deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const deleteSubject = (req, res) =>{
      const subjectId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(subjectId)) {
        return res.status(400).send({ status: false, message: "Invalid subject id" });
      }
      subjectModel
        .findByIdAndDelete(subjectId)
        .then(() => {
          res.send({ status: true, message: "Subject deleted" });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send({ status: false, message: "Error deleting subject" });
        });
}



const getAllSubjectsApi = (req, res) => {
    subjectModel
        .find()
        .populate('teachers_id', 'firstname lastname')
        .populate('classes_id', 'name')
        .then((subjects) => res.send({ status: true, subjects }))
        .catch((error) => {
            console.log(error)
            res.status(500).send({ status: false, message: 'Error fetching subjects' })
        })
}

module.exports = {
  createSubjectPage,
  manageSubjectPage,
  getAllSubjects,
  getAllSubjectsApi,
  createSubject,
  updateSubject,
  deleteSubject,
  editSubject
};