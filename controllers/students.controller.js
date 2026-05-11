const studentsModel = require('../models/students.model');
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const mongoose = require("mongoose");


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const signupPageStudent =(req, res) => {
   res.render("signupstudent");
 } ;

 const loginPageStudent = (req, res) => {
   res.render("loginstudent");
 };
const registerStudent = async (req, res) => {
    let form= new studentsModel(req.body);
  form.save().then((student)=>{
      res.send({ status: true, message: "Registration successful" })
  }).catch((err)=>{
      console.log(err);
      const message = err.errors
          ? Object.values(err.errors)[0].message
          : "Registration failed"
      res.send({ message, status: false });
  });
};



//   try {
//     const { firstname, lastname, email, age, password, dob, gender, address, parent_phone } = req.body;
//     const newStudent = new Student({ firstname, lastname, email, age, password, dob, gender, address, parent_phone });
//     const savedStudent = await newStudent.save();
//     res.status(201).json({ message: 'Student registered successfully', student: savedStudent });
//   } catch (error) {
//     if (error.code === 11000) {
//       res.status(400).json({ message: 'Email already exists' });
//     } else {
//       res.status(500).json({ message: error.message });
//     }
//   }
// };

const loginStudent =  (req, res) => {
 console.log(req.body);
  let { password } = req.body;
  studentsModel
    .findOne({ email: req.body.email })
    .then((students) => {
      // console.log(teacher);
      if (students) {
        //email is valid
        students.validatePassword(password, (err, same) => {
          console.log(password);
          if (!same) {
            res.send({ status: false, message: "Invalid Credentials" });
          } else {
            const token = jwt.sign({ email: students.email, id: students._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
            res.send({ status: true, message: 'Valid Credentials', token, role: 'student' })
          }
        });
      } else {
        console.log("Invalid email");
        res.send({ status: false, message: "Invalid Credential" });
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: false, message: 'Server error' })
    });
};

const getStudentDashboard = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ status: false, message: 'Missing or malformed token' });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, "secret", async (err, decoded) => {
    if (err) {
      console.log(err);
      return res
        .status(401)
        .send({ status: false, message: "Token expired or invalid token" });
    }

    const email = decoded?.email;
    if (!email) {
      return res
        .status(401)
        .send({ status: false, message: "Invalid token payload" });
    }

    try {
      const students = await studentsModel
        .findOne({ email }, { password: 0 })
        .populate('class_id', 'name');

      if (!students) {
        return res
          .status(404)
          .send({ status: false, message: "student not found" });
      }

      return res.send({ status: true, message: "Valid token", students });
    } catch (findErr) {
      console.log(findErr);
      return res
        .status(500)
        .send({ status: false, message: "Error fetching student data" });
    }
  });
};



//   try {
//     const { email, password } = req.body;
//     const student = await Student.findOne({ email });
//     if (!student) {
//       return res.status(404).json({ message: 'Student not found' });
//     }
//     student.validatePassword(password, (err, isValid) => {
//       if (err) {
//         return res.status(500).json({ message: 'Error validating password' });
//       }
//       if (!isValid) {
//         return res.status(401).json({ message: 'Invalid password' });
//       }
//       // For now, no JWT, just return student
//       res.status(200).json({ message: 'Login successful', student });
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const getAllStudents =  (req, res) => {
    studentsModel
        .find()
        .then((students) => {
          res.send({ status: true, students });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send({ status: false, message: "Error fetching students" });
        });
}
//   try {
//     const students = await Student.find();
//     res.status(200).json(students);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const getStudentById = (req, res) => {
    const studentId = req.params.id
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return res.status(400).send({ status: false, message: 'Invalid student id' })
    }
    studentsModel
        .findById(studentId)
        .then((student) => {
            if (!student) return res.status(404).send({ status: false, message: 'Student not found' })
            res.send({ status: true, student })
        })
        .catch((error) => {
            console.log(error)
            res.status(500).send({ status: false, message: 'Error fetching student' })
        })
}

const updateStudent = (req, res) => {
  const studentId = req.params.id
  const { firstname, lastname, email, age, parent_phone, address, dob, gender, class_id } = req.body
  const allowed = { firstname, lastname, email, age, parent_phone, address, dob, gender, class_id }

  studentsModel.findByIdAndUpdate(studentId, allowed, { new: true, runValidators: true })
    .then((updated) => {
      if (!updated) return res.status(404).send({ status: false, message: 'Student not found' })
      console.log('Student Updated')
      res.send({ status: true, message: 'Student updated successfully' })
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: false, message: 'Error updating student' })
    })
}


const deleteStudent = (req, res) =>{
    console.log(req.params.id);
      const studentId = req.params.id;
    
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return res.status(400).send({ status: false, message: "Invalid student id" });
      }
    
      studentsModel
        .findByIdAndDelete(studentId)
        .then(() => {
          res.send({ status: true, message: 'Student deleted' });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send({ status: false, message: "Error deleting student" });
        });
}
const getMyAttendance = async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ status: false, message: 'Unauthorized' })
  }
  const token = authHeader.split(' ')[1]
  jwt.verify(token, process.env.JWT_SECRET || 'secret', async (err, decoded) => {
    if (err) return res.status(401).send({ status: false, message: 'Token expired or invalid' })
    const email = decoded?.email
    if (!email) return res.status(401).send({ status: false, message: 'Invalid token payload' })
    try {
      const student = await studentsModel.findOne({ email }, '_id')
      if (!student) return res.status(404).send({ status: false, message: 'Student not found' })
      const attendanceModel = require('../models/attendance.model')
      const records = await attendanceModel
        .find({ student_id: student._id })
        .populate('class_id', 'name')
        .sort({ date: 1 })
      return res.send({ status: true, records })
    } catch (e) {
      console.log(e)
      return res.status(500).send({ status: false, message: 'Error fetching attendance' })
    }
  })
}

const changePassword = (req, res) => {
  const studentId = req.params.id
  const { currentPassword, newPassword } = req.body
  if (!currentPassword || !newPassword) {
    return res.status(400).send({ status: false, message: 'Both fields are required' })
  }
  studentsModel.findById(studentId)
    .then((student) => {
      if (!student) return res.status(404).send({ status: false, message: 'Student not found' })
      student.validatePassword(currentPassword, (err, same) => {
        if (err) return res.status(500).send({ status: false, message: 'Error validating password' })
        if (!same) return res.status(400).send({ status: false, message: 'Current password is incorrect' })
        student.password = newPassword
        student.save()
          .then(() => res.send({ status: true, message: 'Password changed successfully' }))
          .catch((saveErr) => {
            console.log(saveErr)
            res.status(500).send({ status: false, message: 'Error saving new password' })
          })
      })
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: false, message: 'Server error' })
    })
}

const forgotPasswordStudent = async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).send({ status: false, message: 'Email is required' })
  try {
    const student = await studentsModel.findOne({ email })
    if (!student) return res.status(404).send({ status: false, message: 'No account found with that email' })

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiry = new Date(Date.now() + 15 * 60 * 1000)

    await studentsModel.findByIdAndUpdate(student._id, { resetCode: code, resetCodeExpiry: expiry })

    await sgMail.send({
      from: process.env.SENDGRID_FROM_EMAIL,
      to: email,
      subject: 'Your Password Reset Code',
      html: `<p>Your password reset code is: <strong>${code}</strong></p><p>This code expires in 15 minutes.</p>`
    })

    res.send({ status: true, message: 'Reset code sent to your email' })
  } catch (e) {
    console.log(e)
    res.status(500).send({ status: false, message: e.message ?? 'Server error' })
  }
}

const resetPasswordStudent = async (req, res) => {
  const { email, code, newPassword } = req.body
  if (!email || !code || !newPassword)
    return res.status(400).send({ status: false, message: 'All fields are required' })
  try {
    const student = await studentsModel.findOne({ email })
    if (!student) return res.status(404).send({ status: false, message: 'Account not found' })
    if (!student.resetCode || student.resetCode !== code)
      return res.status(400).send({ status: false, message: 'Invalid reset code' })
    if (!student.resetCodeExpiry || new Date() > student.resetCodeExpiry)
      return res.status(400).send({ status: false, message: 'Reset code has expired. Please request a new one.' })
 
    student.password = newPassword
    student.resetCode = null
    student.resetCodeExpiry = null
    await student.save()
 
    res.send({ status: true, message: 'Password reset successfully' })
  } catch (e) {
    console.log(e)
    res.status(500).send({ status: false, message: e.message ?? 'Error resetting password' })
  }
}
const deactivateStudent = (req, res) => {
  const studentId = req.params.id
  studentsModel.findByIdAndUpdate(studentId, { is_active: false }, { new: true })
    .then((updated) => {
      if (!updated) return res.status(404).send({ status: false, message: 'Student not found' })
      res.send({ status: true, message: 'Account deactivated' })
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send({ status: false, message: 'Error deactivating account' })
    })
}

const uploadImage = (req, res) => {
  if (!req.file) {
    return res.send({ status: false, message: "No file uploaded" });
  }
  const stream = cloudinary.v2.uploader.upload_stream(
    { resource_type: "image" },
    (err, result) => {
      if (err) {
        console.log(err);
        return res.send({ status: false, message: "Upload failed" });
      }
      res.send({ status: true, message: "Uploaded Successfully", imageUrl: result.secure_url });
    }
  );
  stream.end(req.file.buffer);
}

const heartbeatStudent = async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).send({ status: false, message: 'Missing token' })
  const token = authHeader.split(' ')[1]
  jwt.verify(token, process.env.JWT_SECRET || 'secret', async (err, decoded) => {
    if (err) return res.status(401).send({ status: false, message: 'Invalid token' })
    try {
      await studentsModel.findByIdAndUpdate(decoded.id, { lastSeen: new Date() })
      res.send({ status: true })
    } catch (e) {
      res.status(500).send({ status: false })
    }
  })
}

module.exports = {
  signupPageStudent,
  loginPageStudent,
  uploadImage,
  registerStudent,
  loginStudent,
  getAllStudents,
  getStudentDashboard,
  getStudentById,
  updateStudent,
  deleteStudent,
  changePassword,
  deactivateStudent,
  getMyAttendance,
  forgotPasswordStudent,
  resetPasswordStudent,
  heartbeatStudent,
}