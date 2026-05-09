// const express = require('express');
// const router = express.Router();
// const {registerTeacher,landingPage, loginTeacher, getAllTeachers,getTeacherById,updateTeacher, deleteTeacher,getTeacherDashboard } = require('../controllers/teachers.controller');

// // Render teacher page
// // router.get('/', (req, res) => {
// //   res.send('Welcome to the Teacher Page');
// // });
// router.get("/", landingPage)
// // Register a new teacher
// router.post('/signup', registerTeacher);

// // Login teacher
// router.post('/login', loginTeacher);

// // Get all teachers
// router.get('/all-teachers', getAllTeachers);

// // Get teacher by ID
// // router.get('/delete-teacher/:id', getTeacherById);

// // Update teacher
// router.post('/update-teacher/:id', updateTeacher);

// // Delete teacher
// router.delete('/delete-teacher/:id', deleteTeacher);

// // Get teacher dashboard
// router.get('/dashboard/:id', getTeacherDashboard);

// module.exports = router;

const express = require('express');
const router = express.Router();
const {
  landingPage,
  registerTeacher,
  loginPage,
  loginTeacher,
  getAllTeachers,
  editTeacher,
  updateTeacher,
  deleteTeacher,
  signupPage,
  getTeacherDashboard,
  forgotPasswordTeacher,
  resetPasswordTeacher,
  heartbeatTeacher,
} = require('../controllers/teachers.controller');
const {
  registerStudent,
  signupPageStudent,
  loginPageStudent,
  loginStudent,
    getStudentById,
  getAllStudents,       // ✅ added
  updateStudent,
  deleteStudent,
} = require('../controllers/students.controller');
const { createSubjectPage, manageSubjectPage, getAllSubjects,
  createSubject,
  editSubject,
  updateSubject,
  deleteSubject } = require('../controllers/subjects.controller');
  const {createTestPage, getAllTests, getTestById, createTest, updateTest, editTest, deleteTest} = require('../controllers/test.controller');
const { createTimetablePage, getAllTimetables, getTimetableById, createTimetable, updateTimetable, editTimetable, deleteTimetable } = require('../controllers/timetables.controller');
const { getAllExams, createExamPage,  getExamById, createExam, updateExam, editExam, deleteExam } = require('../controllers/exams.controller');
const { getAllResults, createResultPage, getResultById, createResult, updateResult, editResult, deleteResult } = require('../controllers/result.controller');
const { createAttendancePage, getAllAttendance, editAttendance, createAttendance, updateAttendance, deleteAttendance } = require('../controllers/attendance.controller');
const { getAllClasses, createClassPage, createClass, editClasses, updateClass, deleteClass } = require('../controllers/classes.controller');
router.get('/', landingPage);
router.post('/register',              registerTeacher);
router.get('/signup',               signupPage);  
router.get('/login',                loginPage);
router.post('/login',               loginTeacher);
router.post('/logins',              loginTeacher);
router.get('/all-teachers',         getAllTeachers);
router.get('/dashboard',        getTeacherDashboard);
// router.get('/:id',                  getTeacherById);       // ✅ fixed path
router.get('/edit-teacher/:id', editTeacher);
router.post('/update-teacher/:id', updateTeacher);
router.get('/delete-teacher/:id', deleteTeacher);
router.post('/forgot-password', forgotPasswordTeacher);
router.post('/reset-password',  resetPasswordTeacher);
router.post('/heartbeat', heartbeatTeacher);

router.post('/registerstudent',             registerStudent);
router.get('/signupstudent',                signupPageStudent);
router.get('/loginstudent',                 loginPageStudent);
router.get('/all-students',                 getAllStudents);
router.get('/edit-student/:id',             getStudentById);
router.post('/update-student/:id',          updateStudent);
router.get('/delete-student/:id',           deleteStudent);

// subject routes
router.get('/addsubject', createSubjectPage);
router.get('/managesubject', manageSubjectPage);
router.get('/all-subjects', getAllSubjects);
router.post('/create-subject', createSubject);
router.get('/edit-subject/:id', editSubject);
router.post('/update-subject/:id', updateSubject);
router.get('/delete-subject/:id', deleteSubject);

// result routes
router.get("/addresults", createResultPage );
router.get('/all-results', getAllResults);
router.post('/create-result', createResult);
router.get('/edit-result/:id', editResult);
router.post('/update-result/:id', updateResult);
router.get('/delete-result/:id', deleteResult);

// exam routes
router.get('/addexams', createExamPage);
router.get('/all-exams', getAllExams);
router.post('/create-exam', createExam);
router.get('/edit-exam/:id', editExam);
router.post('/update-exam/:id', updateExam);
router.get('/delete-exam/:id', deleteExam);

// timetable routes
router.get('/addtimetable', createTimetablePage);
router.get('/all-timetables', getAllTimetables);
router.post('/create-timetable', createTimetable);
router.get('/edit-timetable/:id', editTimetable);
router.post('/update-timetable/:id', updateTimetable);
router.get('/delete-timetable/:id', deleteTimetable);
// class routes
router.get('/addclass', createClassPage);
router.get('/all-classes', getAllClasses);
router.post('/create-class', createClass);
router.get('/edit-class/:id', editClasses);
router.post('/update-class/:id', updateClass);
router.get('/delete-class/:id', deleteClass);

// attendance routes
router.get('/addattendance', createAttendancePage);
router.get('/all-attendance', getAllAttendance);
router.post('/create-attendance', createAttendance);
router.get('/edit-attendance/:id', editAttendance);
router.post('/update-attendance/:id', updateAttendance);
router.get('/delete-attendance/:id', deleteAttendance);


router.get('/addtest', createTestPage);
router.get('/all-tests', getAllTests);
router.post('/create-test', createTest);
router.get('/edit-test/:id', editTest);
router.post('/update-test/:id', updateTest);
router.get('/delete-test/:id', deleteTest);
module.exports = router;