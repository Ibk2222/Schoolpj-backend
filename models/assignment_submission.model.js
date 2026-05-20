const mongoose = require('mongoose')

const answerSchema = new mongoose.Schema({
  question_index: { type: Number, required: true },
  answer: { type: String, required: true, trim: true },
}, { _id: false })

const submissionSchema = new mongoose.Schema({
  assignment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'assignments', required: true },
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'students', required: true },
  answers: { type: [answerSchema], validate: { validator: v => v.length > 0, message: 'At least one answer is required' } },
  submitted_at: { type: Date, default: Date.now },
}, { timestamps: true })

// one submission per student per assignment
submissionSchema.index({ assignment_id: 1, student_id: 1 }, { unique: true })

module.exports = mongoose.model('assignment_submissions', submissionSchema)
