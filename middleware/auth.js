const jwt = require('jsonwebtoken')
const teacherModel = require('../models/teachers.model')
const adminModel = require('../models/admin.model')
const studentsModel = require('../models/students.model')

const JWT_SECRET = process.env.JWT_SECRET || 'secret'

const requireTeacherOrAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ status: false, message: 'Missing or malformed token' })
  }
  const token = authHeader.split(' ')[1]
  let decoded
  try {
    decoded = jwt.verify(token, JWT_SECRET)
  } catch {
    return res.status(401).send({ status: false, message: 'Token expired or invalid' })
  }
  const { email } = decoded
  if (!email) return res.status(401).send({ status: false, message: 'Invalid token payload' })

  try {
    let user = await teacherModel.findOne({ email }, 'firstname lastname email _id role')
    if (user) { req.user = { ...user.toObject(), role: 'teacher' }; return next() }
    user = await adminModel.findOne({ email }, 'firstname lastname email _id role')
    if (user) { req.user = { ...user.toObject(), role: 'admin' }; return next() }
    return res.status(403).send({ status: false, message: 'Access denied' })
  } catch {
    return res.status(500).send({ status: false, message: 'Server error' })
  }
}

const requireStudent = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ status: false, message: 'Missing or malformed token' })
  }
  const token = authHeader.split(' ')[1]
  let decoded
  try {
    decoded = jwt.verify(token, JWT_SECRET)
  } catch {
    return res.status(401).send({ status: false, message: 'Token expired or invalid' })
  }
  const { email } = decoded
  if (!email) return res.status(401).send({ status: false, message: 'Invalid token payload' })

  try {
    const student = await studentsModel.findOne({ email }, 'firstname lastname email _id class_id')
    if (!student) return res.status(403).send({ status: false, message: 'Access denied' })
    req.user = { ...student.toObject(), role: 'student' }
    next()
  } catch {
    return res.status(500).send({ status: false, message: 'Server error' })
  }
}

module.exports = { requireTeacherOrAdmin, requireStudent }
