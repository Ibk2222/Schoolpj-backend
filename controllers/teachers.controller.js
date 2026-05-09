const teacherModel = require("../models/teachers.model");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);
const mongoose = require("mongoose");


const landingPage = (req, res) => {
  res.render("index");
}
 const signupPage =(req, res) => {
   res.render("signup");
 } ;

 const loginPage = (req, res) => {
   res.render("login");
 };

const registerTeacher =  (req, res) => {
   let form= new teacherModel(req.body);
   form.save().then((teacher)=>{
       res.send({ status: true, message: "Registration successful" })
   }).catch((err)=>{
       console.log(err);
       const message = err.errors
           ? Object.values(err.errors)[0].message
           : "Registration failed"
       res.send({ message, status: false });
   });
 };
const loginTeacher = (req, res) => {
  console.log(req.body);
  let { password } = req.body;
  teacherModel
    .findOne({ email: req.body.email })
    .then((teacher) => {
      if (teacher) {
        teacher.validatePassword(password, (err, same) => {
          if (!same) {
            res.send({ status: false, message: "Invalid Credentials" });
          } else {
            if (teacher.approval_status === 'pending') {
              return res.send({ status: false, message: "Your account is pending admin approval. Please wait." });
            }
            if (teacher.approval_status === 'rejected') {
              return res.send({ status: false, message: "Your account has been rejected. Please contact the administrator." });
            }
            const token = jwt.sign({ email: teacher.email, id: teacher._id }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
            res.send({ status: true, message: "Valid Credentials", token, role: 'teacher' });
          }
        });
      } else {
        res.send({ status: false, message: "Invalid Credential" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ status: false, message: 'Server error' });
    });
};

  // try {
  //   const { firstname, lastname, email, age, password, phone, joined_in } = req.body;
  //   const newTeacher = new teacherModel({ firstname, lastname, email, age, password, phone, joined_in });
  //   const savedTeacher = await newTeacher.save();
  //   res.status(201).json({ message: 'Teacher registered successfully', teacher: savedTeacher });
  // } catch (error) {
  //   if (error.code === 11000) {
  //     res.status(400).json({ message: 'Email already exists' });
  //   } else {
  //     res.status(500).json({ message: error.message });
  //   }
  // }


// const loginTeacher = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const teacher = await teacherModel.findOne({ email });
//     if (!teacher) {
//       return res.status(404).json({ message: 'Teacher not found' });
//     }
//     teacher.validatePassword(password, (err, isValid) => {
//       if (err) {
//         return res.status(500).json({ message: 'Error validating password' });
//       }
//       if (!isValid) {
//         return res.status(401).json({ message: 'Invalid password' });
//       }
//       res.status(200).json({ message: 'Login successful', teacher });
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const getTeacherDashboard = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .send({ status: false, message: "Missing or malformed token" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET || "secret", async (err, decoded) => {
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
      const teacher = await teacherModel.findOne(
        { email },
        { title: 1, firstname: 1, lastname: 1, email: 1, age: 1, phone: 1, joined_in: 1, role: 1, _id: 1 },
      );

      if (!teacher) {
        return res
          .status(404)
          .send({ status: false, message: "teacher not found" });
      }

      return res.send({ status: true, teacher });
    } catch (findErr) {
      console.log(findErr);
      return res
        .status(500)
        .send({ status: false, message: "Error fetching teacher data" });
    }
  });
};
// const getAllTeachers = async (req, res) => {
//   try {
//     const teachers = await Teacher.find();
//     res.status(200).json(teachers);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const getAllTeachers = (req, res) =>{
     teacherModel
        .find()
        .then((teachers) => {
          res.send({ status: true, teachers });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send({ status: false, message: "Error fetching teachers" });
        });
}

const deleteTeacher = (req, res) =>{
    console.log(req.params.id);
      const teacherId = req.params.id;
    
      if (!mongoose.Types.ObjectId.isValid(teacherId)) {
        return res.status(400).send({ status: false, message: "Invalid teacher id" });
      }
    
      teacherModel
        .findByIdAndDelete(teacherId)
        .then(() => {
          res.send({ status: true, message: "Teacher deleted" });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send({ status: false, message: "Error deleting teacher" });
        });
}

const editTeacher = (req, res) =>{
  const teacherId = req.params.id;
    
      if (!mongoose.Types.ObjectId.isValid(teacherId)) {
        return res.status(400).send({ status: false, message: "Invalid teacher id" });
      }
    
      teacherModel
        .findById(teacherId)
        .then((teacher) => {
          res.render("editTeacher", { teacher });
          console.log(teacher);
        })
        .catch((error) => {
          console.log("There is an error");
          console.log(error);
           res
        .status(500)
        .send({ status: false, message: "Error fetching teacher data" });
        });
}

const updateTeacher = (req, res) =>{
    const teacherId = req.params.id
    teacherModel.findByIdAndUpdate(teacherId, req.body, { new: true })
      .then(()=>{
        res.send({ status: true, message: 'Teacher updated' })
      })
      .catch((error)=>{
        console.log(error)
        res.status(500).send({ status: false, message: "Error updating teacher" });
      })
}

// const getTeacherById = async (req, res) => {
//   const teacherId = req.params.id;

//       if (!mongoose.Types.ObjectId.isValid(teacherId)) {
//         return res.status(404).send({message: "Invalid teacher id"});
//       }
//       return res.status(404).send({message: "valid teacher id"});
//     }catch (error) {
//     res.status(500).json({ message: error.message });
//   }

  // try {
  //   const teacher = await teacherModel.findById(req.params.id);
  //   if (!teacher) {
  //     return res.status(404).json({ message: 'Teacher not found' });
  //   }
  //   res.status(200).json(teacher);
 


// const updateTeacher = async (req, res) => {
//   try {
//     const { firstname, lastname, email, age, phone, joined_in, is_active } = req.body;
//     const updatedTeacher = await teacherModel.findByIdAndUpdate(
//       req.params.id,
//       { firstname, lastname, email, age, phone, joined_in, is_active },
//       { new: true, runValidators: true }
//     );
//     if (!updatedTeacher) {
//       return res.status(404).json({ message: 'Teacher not found' });
//     }
//     res.status(200).json(updatedTeacher);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const deleteTeacher = async (req, res) => {
//   try {
//     const deletedTeacher = await teacherModel.findByIdAndDelete(req.params.id);
//     if (!deletedTeacher) {
//       return res.status(404).json({ message: 'Teacher not found' });
//     }
//     res.status(200).json({ message: 'Teacher deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const approveTeacher = async (req, res) => {
  const teacherId = req.params.id
  if (!mongoose.Types.ObjectId.isValid(teacherId))
    return res.status(400).send({ status: false, message: 'Invalid teacher id' })
  try {
    const teacher = await teacherModel.findByIdAndUpdate(teacherId, { approval_status: 'approved' }, { new: true })
    if (!teacher) return res.status(404).send({ status: false, message: 'Teacher not found' })
    res.send({ status: true, message: 'Teacher approved successfully' })
  } catch (e) {
    console.log(e)
    res.status(500).send({ status: false, message: 'Error approving teacher' })
  }
}

const rejectTeacher = async (req, res) => {
  const teacherId = req.params.id
  if (!mongoose.Types.ObjectId.isValid(teacherId))
    return res.status(400).send({ status: false, message: 'Invalid teacher id' })
  try {
    const teacher = await teacherModel.findByIdAndUpdate(teacherId, { approval_status: 'rejected' }, { new: true })
    if (!teacher) return res.status(404).send({ status: false, message: 'Teacher not found' })
    res.send({ status: true, message: 'Teacher rejected' })
  } catch (e) {
    console.log(e)
    res.status(500).send({ status: false, message: 'Error rejecting teacher' })
  }
}

const forgotPasswordTeacher = async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).send({ status: false, message: 'Email is required' })
  try {
    const teacher = await teacherModel.findOne({ email })
    if (!teacher) return res.status(404).send({ status: false, message: 'No account found with that email' })

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiry = new Date(Date.now() + 15 * 60 * 1000)

    await teacherModel.findByIdAndUpdate(teacher._id, { resetCode: code, resetCodeExpiry: expiry })

    await resend.emails.send({
      from: 'ABC School <onboarding@resend.dev>',
      to: [email],
      subject: 'Your Password Reset Code',
      html: `<p>Your password reset code is: <strong>${code}</strong></p><p>This code expires in 15 minutes.</p>`
    })

    res.send({ status: true, message: 'Reset code sent to your email' })
  } catch (e) {
    console.log(e)
    res.status(500).send({ status: false, message: 'Server error' })
  }
}
 
const resetPasswordTeacher = async (req, res) => {
  const { email, code, newPassword } = req.body
  if (!email || !code || !newPassword)
    return res.status(400).send({ status: false, message: 'All fields are required' })
  try {
    const teacher = await teacherModel.findOne({ email })
    if (!teacher) return res.status(404).send({ status: false, message: 'Account not found' })
    if (!teacher.resetCode || teacher.resetCode !== code)
      return res.status(400).send({ status: false, message: 'Invalid reset code' })
    if (!teacher.resetCodeExpiry || new Date() > teacher.resetCodeExpiry)
      return res.status(400).send({ status: false, message: 'Reset code has expired. Please request a new one.' })
    teacher.password = newPassword
    teacher.resetCode = null
    teacher.resetCodeExpiry = null
    await teacher.save()
 
    res.send({ status: true, message: 'Password reset successfully' })
  } catch (e) {
    console.log(e)
    res.status(500).send({ status: false, message: e.message ?? 'Error resetting password' })
  }
}

module.exports = {
  landingPage,
  registerTeacher,
  loginTeacher,
  loginPage,
  signupPage,
  getAllTeachers,
  editTeacher,
  updateTeacher,
  getTeacherDashboard,
  deleteTeacher,
  approveTeacher,
  rejectTeacher,
  forgotPasswordTeacher,
  resetPasswordTeacher,
};