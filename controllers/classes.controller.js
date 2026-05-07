const classesModel = require('../models/classes.model');
const studentsModel = require('../models/students.model');
const teachersModel = require('../models/teachers.model');
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const createClassPage = async (req, res) => {
  
  try {
    const [students, teachers] = await Promise.all([
      studentsModel.find({}, 'firstname lastname _id'),
      teachersModel.find({}, 'firstname lastname _id'),
    ]);
    const isTeacher = req.originalUrl.startsWith('/teacher');
    const formAction = isTeacher ? '/teacher/create-class' : '/admin/create-class';
    res.render("addclass", { students, teachers, formAction });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error loading form data");
  }
};

const getAllClasses = (req, res) => {
  classesModel
        .find()
        .then((classes) => {
          res.send({ status: true, classes });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send({ status: false, message: "Error fetching classes" });
        });
}

const editClasses = (req, res) => {
   const classesId = req.params.id;
    
      if (!mongoose.Types.ObjectId.isValid(classesId)) {
        return res.status(400).send({ status: false, message: "Invalid class id" });
      }
    
      classesModel
        .findById(classesId)
        .then((classes) => {
          res.render("edit-class", { classes });
          console.log(classes);
        })
        .catch((error) => {
          console.log("There is an error");
          console.log(error);
           res
        .status(500)
        .send({ status: false, message: "Error fetching teacher data" });
        });
}

const createClass =  (req, res) => {
   let form = new classesModel(req.body);
      form
        .save()
        .then(() => {
          res.send({ status: true, message: "Class added successfully" });
        })
        .catch((error) => {
          console.log(error);
          const message = error.errors
            ? Object.values(error.errors)[0].message
            : error.message ?? "Error adding class";
          res.status(400).send({ status: false, message });
        });
}

const updateClass =  (req, res) => {
    const classesId = req.params.id

      classesModel.findByIdAndUpdate(classesId, req.body, { new: true })
      .then(()=>{
        res.send({ status: true, message: "Class updated successfully" });
      })
      .catch((error)=>{
        console.log(error)
        res.status(500).send({ status: false, message: "Error updating class" });
      })
}

const deleteClass =  (req, res) => {
      const classesId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(classesId)) {
        return res.status(400).send({ status: false, message: "Invalid class id" });
      }

      classesModel
        .findByIdAndDelete(classesId)
        .then(() => {
          res.send({ status: true, message: "Class deleted" });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send({ status: false, message: "Error deleting class" });
        });

};

module.exports = {
  getAllClasses,
  // getClassById,
  createClass,
  createClassPage,
  editClasses,
  updateClass,
  deleteClass
};