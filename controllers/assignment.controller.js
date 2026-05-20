const mongoose = require('mongoose')
const assignmentModel = require('../models/assignment.model')
const submissionModel = require('../models/assignment_submission.model')

// ── Teacher / Admin ────────────────────────────────────────────────────────

const getAllAssignments = async (req, res) => {
  try {
    const assignments = await assignmentModel
      .find()
      .populate('class_id', 'name')
      .populate('subject_id', 'subject_name')
      .populate('teacher_id', 'firstname lastname')
      .sort({ createdAt: -1 })
    res.send({ status: true, assignments })
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: 'Error fetching assignments' })
  }
}

const getAssignmentById = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send({ status: false, message: 'Invalid assignment id' })
  try {
    const assignment = await assignmentModel
      .findById(id)
      .populate('class_id', 'name')
      .populate('subject_id', 'subject_name')
      .populate('teacher_id', 'firstname lastname')
    if (!assignment) return res.status(404).send({ status: false, message: 'Assignment not found' })
    res.send({ status: true, assignment })
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: 'Error fetching assignment' })
  }
}

const createAssignment = async (req, res) => {
  try {
    const { title, description, class_id, subject_id, due_date, questions } = req.body
    const teacher_id = req.user._id
    const assignment = new assignmentModel({ title, description, class_id, subject_id, teacher_id, due_date, questions })
    await assignment.save()
    res.send({ status: true, message: 'Assignment created successfully', assignment })
  } catch (err) {
    console.log(err)
    const message = err.errors ? Object.values(err.errors)[0].message : (err.message ?? 'Error creating assignment')
    res.status(500).send({ status: false, message })
  }
}

const updateAssignment = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send({ status: false, message: 'Invalid assignment id' })
  try {
    const updated = await assignmentModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    if (!updated) return res.status(404).send({ status: false, message: 'Assignment not found' })
    res.send({ status: true, message: 'Assignment updated successfully', assignment: updated })
  } catch (err) {
    console.log(err)
    const message = err.errors ? Object.values(err.errors)[0].message : (err.message ?? 'Error updating assignment')
    res.status(500).send({ status: false, message })
  }
}

const deleteAssignment = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send({ status: false, message: 'Invalid assignment id' })
  try {
    const deleted = await assignmentModel.findByIdAndDelete(id)
    if (!deleted) return res.status(404).send({ status: false, message: 'Assignment not found' })
    await submissionModel.deleteMany({ assignment_id: id })
    res.send({ status: true, message: 'Assignment deleted successfully' })
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: 'Error deleting assignment' })
  }
}

const getAssignmentSubmissions = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send({ status: false, message: 'Invalid assignment id' })
  try {
    const submissions = await submissionModel
      .find({ assignment_id: id })
      .populate('student_id', 'firstname lastname email class_id')
      .sort({ submitted_at: -1 })
    res.send({ status: true, submissions })
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: 'Error fetching submissions' })
  }
}

// ── Student ────────────────────────────────────────────────────────────────

const getMyAssignments = async (req, res) => {
  try {
    const classId = req.user.class_id
    const query = classId ? { class_id: classId, is_active: true } : { is_active: true }
    const assignments = await assignmentModel
      .find(query)
      .populate('class_id', 'name')
      .populate('subject_id', 'subject_name')
      .populate('teacher_id', 'firstname lastname')
      .sort({ due_date: 1 })
    res.send({ status: true, assignments })
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: 'Error fetching assignments' })
  }
}

const getAssignmentForStudent = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send({ status: false, message: 'Invalid assignment id' })
  try {
    const assignment = await assignmentModel
      .findOne({ _id: id, is_active: true })
      .populate('class_id', 'name')
      .populate('subject_id', 'subject_name')
      .populate('teacher_id', 'firstname lastname')
    if (!assignment) return res.status(404).send({ status: false, message: 'Assignment not found' })
    const submission = await submissionModel.findOne({ assignment_id: id, student_id: req.user._id })
    res.send({ status: true, assignment, already_submitted: !!submission })
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: 'Error fetching assignment' })
  }
}

const submitAssignment = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send({ status: false, message: 'Invalid assignment id' })
  try {
    const assignment = await assignmentModel.findOne({ _id: id, is_active: true })
    if (!assignment) return res.status(404).send({ status: false, message: 'Assignment not found' })

    const existing = await submissionModel.findOne({ assignment_id: id, student_id: req.user._id })
    if (existing) return res.status(400).send({ status: false, message: 'You have already submitted this assignment' })

    const submission = new submissionModel({
      assignment_id: id,
      student_id: req.user._id,
      answers: req.body.answers,
    })
    await submission.save()
    res.send({ status: true, message: 'Assignment submitted successfully', submission })
  } catch (err) {
    console.log(err)
    const message = err.errors ? Object.values(err.errors)[0].message : (err.message ?? 'Error submitting assignment')
    res.status(500).send({ status: false, message })
  }
}

const getMySubmission = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send({ status: false, message: 'Invalid assignment id' })
  try {
    const submission = await submissionModel
      .findOne({ assignment_id: id, student_id: req.user._id })
      .populate('assignment_id', 'title questions due_date')
    if (!submission) return res.status(404).send({ status: false, message: 'No submission found' })
    res.send({ status: true, submission })
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: 'Error fetching submission' })
  }
}

module.exports = {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAssignmentSubmissions,
  getMyAssignments,
  getAssignmentForStudent,
  submitAssignment,
  getMySubmission,
}
