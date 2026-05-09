const express = require('express');
const router = express.Router();
const {
  registerAdmin, signupPageAdmin, loginPageAdmin, loginAdmin, getAllAdmins, getAdminById, updateAdmin,
  deleteAdmin, getAdminDashboard, forgotPasswordAdmin, resetPasswordAdmin,
} = require('../controllers/admin.controller');
const {
  createTimetablePage, getAllTimetables, getTimetableById, createTimetable, updateTimetable, editTimetable, deleteTimetable
} = require('../controllers/timetables.controller');
const {
  createExamPage, getAllExams, getExamById, createExam, updateExam, editExam, deleteExam
} = require('../controllers/exams.controller');
  const {landingPage,registerTeacher,
  loginPage, loginTeacher,getAllTeachers, editTeacher, updateTeacher, deleteTeacher, signupPage, getTeacherDashboard,
  approveTeacher, rejectTeacher} = require('../controllers/teachers.controller');
const{ createSubjectPage, manageSubjectPage, getAllSubjects, getAllSubjectsApi,
  createSubject,
  updateSubject,
  deleteSubject,
  editSubject} =require('../controllers/subjects.controller')
const {
  registerStudent,signupPageStudent,loginPageStudent,loginStudent,getStudentById,getAllStudents,updateStudent,deleteStudent
} = require('../controllers/students.controller');
const{ createResultPage, getAllResults, getResultById, createResult, updateResult,editResult,deleteResult }
= require('../controllers/result.controller');
const {createTestPage, getAllTests, getTestById, createTest, updateTest, editTest, deleteTest} = require('../controllers/test.controller');
const {
  createAttendancePage,
  getAllAttendance,
  editAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance
} = require('../controllers/attendance.controller');

const { getAllClasses,
  createClass,
  createClassPage,
  editClasses,
  updateClass,
  deleteClass } = require('../controllers/classes.controller');

router.post('/registersadmin', registerAdmin);
router.post('/forgot-password', forgotPasswordAdmin);
router.post('/reset-password',  resetPasswordAdmin);
router.get('/signupadmin', signupPageAdmin);
router.post('/signinadmin', loginAdmin);
router.get('/loginadmin', loginPageAdmin);
router.get('/dashboardadmin', getAdminDashboard);
router.get('/all-admins', getAllAdmins);
router.get('/edit-admin/:id', getAdminById);
router.put('/update-admin/:id', updateAdmin);
router.delete('/delete-admin/:id', deleteAdmin)
router.post('/registerstudent',              registerStudent);
router.get('/signupstudent',               signupPageStudent);  
router.get('/loginstudent',                loginPageStudent);  
router.post('/logins',               loginStudent);
router.get('/all-students',         getAllStudents);
router.get('/edit-student/:id',     getStudentById);          // ✅ added
router.post('/update-student/:id',  updateStudent);        // ✅ changed PUT to POST for EJS forms
router.get('/delete-student/:id',   deleteStudent);  
router.get('/',                     landingPage);
router.post('/register',              registerTeacher);
router.get('/signup',               signupPage);  
router.get('/login',                loginPage);  
router.post('/logins',               loginTeacher);
router.get('/all-teachers',         getAllTeachers);
router.get('/dashboard',        getTeacherDashboard);     // ✅ fixed path
router.get('/edit-teacher/:id', editTeacher);
router.post('/update-teacher/:id', updateTeacher);
router.get('/delete-teacher/:id', deleteTeacher);
router.post('/approve-teacher/:id', approveTeacher);
router.post('/reject-teacher/:id', rejectTeacher);

// attendance routes
router.get('/addattendance', createAttendancePage);
router.get('/all-attendance', getAllAttendance);
router.post('/create-attendance', createAttendance);
router.get('/edit-attendance/:id', editAttendance);
router.post('/update-attendance/:id', updateAttendance);
router.get('/delete-attendance/:id', deleteAttendance);

// subject routes
router.get('/subjects-list', getAllSubjectsApi);
router.get('/add-subject', createSubjectPage);
router.get('/managesubject', manageSubjectPage);
router.get('/all-subjects', getAllSubjects);
router.post('/create-subject', createSubject);
router.get('/edit-subject/:id', editSubject);
router.post('/update-subject/:id', updateSubject);
router.get('/delete-subject/:id', deleteSubject);

// result routes
router.get('/addresults', createResultPage);
router.get('/all-results', getAllResults);
router.post('/create-result', createResult);
router.get('/edit-result/:id', editResult);
router.post('/update-result/:id', updateResult);
router.get('/delete-result/:id', deleteResult);

// timeTable routes
router.get('/addtimetable', createTimetablePage);
router.get('/all-timetables', getAllTimetables);
router.post('/create-timetable', createTimetable);
router.get('/edit-timetable/:id', editTimetable);
router.post('/update-timetable/:id', updateTimetable);
router.get('/delete-timetable/:id', deleteTimetable);

// exam routes
router.get('/addexams', createExamPage);
router.get('/all-exams', getAllExams);
router.post('/create-exam', createExam);
router.get('/edit-exam/:id', editExam);
router.post('/update-exam/:id', updateExam);
router.get('/delete-exam/:id', deleteExam);

// class routes
router.get('/addclass', createClassPage);
router.get('/all-classes', getAllClasses);
router.post('/create-class', createClass);
router.get('/edit-class/:id', editClasses);
router.post('/update-class/:id', updateClass);
router.get('/delete-class/:id', deleteClass);

// test routes
router.get('/addtest', createTestPage);
router.get('/all-tests', getAllTests);
router.post('/create-test', createTest);
router.get('/edit-test/:id', editTest);
router.post('/update-test/:id', updateTest);
router.get('/delete-test/:id', deleteTest);

module.exports = router;