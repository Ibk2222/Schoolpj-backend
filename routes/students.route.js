const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });
const {landingPage} = require('../controllers/teachers.controller');
const { getAllTests, getTestById } = require('../controllers/test.controller');
const {
  registerStudent,
  loginStudent,
  uploadImage,
  getStudentById,
  getAllStudents,
  getStudentDashboard,
  updateStudent,
  deleteStudent,
  signupPageStudent,
  loginPageStudent,
  changePassword,
  deactivateStudent,
  getMyAttendance,
  forgotPasswordStudent,
  resetPasswordStudent,
  heartbeatStudent,
} = require('../controllers/students.controller');



router.get('/registerstudent', (req, res) => res.redirect('/students/signupstudent'));
router.post('/registerstudent', registerStudent);
router.get('/signupstudent',               signupPageStudent);
router.get('/loginstudent',                loginPageStudent);  
router.post('/logins',               loginStudent);
router.get('/all-students',         getAllStudents);
router.get('/dashboardstudent',        getStudentDashboard);
// router.get('/:id',                  getTeacherById);       // ✅ fixed path // ✅ changed DELETE to GET for EJS links
// router.get('/:id',                  getTeacherById);       // ✅ fixed path
router.get('/edit-student/:id',     getStudentById);          // ✅ added
router.post('/update-student/:id',  updateStudent);        // ✅ changed PUT to POST for EJS forms
router.get('/delete-student/:id',   deleteStudent);   // ✅ changed DELETE to GET for EJS links
router.post('/upload', upload.single('image'), uploadImage);
router.post('/change-password/:id', changePassword);
router.post('/deactivate/:id', deactivateStudent);
router.get('/my-attendance', getMyAttendance);
router.post('/forgot-password', forgotPasswordStudent);
router.post('/reset-password', resetPasswordStudent);
router.post('/heartbeat', heartbeatStudent);

// test routes
router.get('/all-tests', getAllTests);
router.get('/test/:id', getTestById);

module.exports = router;