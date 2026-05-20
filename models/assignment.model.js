const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  type: { type: String, enum: ['text', 'multiple_choice'], default: 'text' },
  options: [{ type: String, trim: true }],
}, { _id: true })

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true, default: '' },
  class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'classes', required: true },
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'subjects', required: true },
  teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: 'teachers', default: null },
  due_date: { type: Date, required: true },
  questions: { type: [questionSchema], validate: { validator: v => v.length > 0, message: 'At least one question is required' } },
  is_active: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = mongoose.model('assignments', assignmentSchema)
