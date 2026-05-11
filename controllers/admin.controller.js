const adminModel = require('../models/admin.model');
const jwt = require("jsonwebtoken");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const signupPageAdmin =(req, res) => {
   res.render("signupadmin");
 } ;

 const loginPageAdmin = (req, res) => {
   res.render("loginadmin");
 };

const registerAdmin = async (req, res) => {
  try {
    const approvedCount = await adminModel.countDocuments({ approval_status: 'approved' })
    const form = new adminModel(req.body)
    if (approvedCount === 0) form.approval_status = 'approved'
    await form.save()
    const msg = approvedCount === 0
      ? 'Registration successful. You can now log in.'
      : 'Registration successful. Please wait for an existing admin to approve your account.'
    res.send({ status: true, message: msg })
  } catch (err) {
    console.log(err)
    const message = err.errors
      ? Object.values(err.errors)[0].message
      : 'Registration failed'
    res.send({ message, status: false })
  }
};

const loginAdmin = async (req, res) => {
  console.log(req.body);
  let { password } = req.body;
  adminModel.findOne({ email: req.body.email })
    .then((admin) => {
      // console.log(teacher);
      if (admin) {
        //email is valid
        admin.validatePassword(password, (err, same) => {
          if (err) {
            console.log(err);
            return res.status(500).send({ status: false, message: 'Server error' });
          }
          if (!same) {
            console.log("Invalid password");
            return res.send({ status: false, message: "Invalid Credentials" });
          }
          if (admin.approval_status === 'pending') {
            return res.send({ status: false, message: 'Your account is pending approval from an existing admin. Please wait.' })
          }
          if (admin.approval_status === 'rejected') {
            return res.send({ status: false, message: 'Your account has been rejected. Please contact the administrator.' })
          }
          const token = jwt.sign({ email: admin.email, id: admin._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
          res.send({ status: true, message: 'Valid Credentials', token, role: 'admin' })
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

const getAllAdmins =  (req, res) => {
   adminModel.find()
        .then((admins) => {
          res.send({ status: true, admins });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send({ status: false, message: "Error fetching admins" });
        });
}

const getAdminById = async (req, res) => {
    const adminId = req.params.id;
    
          if (!mongoose.Types.ObjectId.isValid(adminId)) {
            return res.status(400).send("Invalid admin id");
          }
       adminModel
        .findById(adminId)
        .then((admin) => {
          res.render("editadmin", {admin});
          console.log(admin);
        })
        .catch((error) => {
          console.log("There is an error");
          console.log(error);
          res.status(500).send("Error loading admin data");
        });
}
    
//   try {
//     const admin = await Admin.findById(req.params.id);
//     if (!admin) {
//       return res.status(404).json({ message: 'Admin not found' });
//     }
//     res.status(200).json(admin);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const updateAdmin =  (req, res) => {
const adminId = req.params.id;
      adminModel.findByIdAndUpdate(adminId, req.body, { new: true })
      .then(()=>{
        res.send({ status: true, message: "Admin updated successfully" });
      })
      .catch((error)=>{
        console.log(error)
        res.status(500).send({ status: false, message: "Error updating admin" });
      })
}

const deleteAdmin = (req, res) => {
      const adminId = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(adminId)) {
        return res.status(400).send({ status: false, message: "Invalid admin id" });
      }

      adminModel
        .findByIdAndDelete(adminId)
        .then(() => {
          res.send({ status: true, message: "Admin deleted" });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send({ status: false, message: "Error deleting admin" });
        });
}
const getAdminDashboard = async (req, res) => {
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
        const admin = await adminModel.findOne(
          { email },
          { firstname: 1, lastname: 1, email: 1, age: 1, phone: 1, joined_in: 1, role: 1, _id: 1 },
        );
  
        if (!admin) {
          return res
            .status(404)
            .send({ status: false, message: "admin not found" });
        }
  
        const teachersModel = require('../models/teachers.model')
        const studentsModel = require('../models/students.model')
        const classesModel  = require('../models/classes.model')
        const subjectsModel = require('../models/subjects.model')
        const [totalTeachers, activeTeachers, totalStudents, activeStudents, totalClasses, totalSubjects] = await Promise.all([
          teachersModel.countDocuments(),
          teachersModel.countDocuments({ is_active: true }),
          studentsModel.countDocuments(),
          studentsModel.countDocuments({ is_active: true }),
          classesModel.countDocuments(),
          subjectsModel.countDocuments(),
        ])
        return res.send({ status: true, admin, stats: { totalTeachers, activeTeachers, totalStudents, activeStudents, totalClasses, totalSubjects } });
      } catch (findErr) {
        console.log(findErr);
        return res
          .status(500)
          .send({ status: false, message: "Error fetching admin data" });
      }
    });}

const approveAdmin = async (req, res) => {
  const adminId = req.params.id
  if (!mongoose.Types.ObjectId.isValid(adminId))
    return res.status(400).send({ status: false, message: 'Invalid admin id' })
  try {
    const admin = await adminModel.findByIdAndUpdate(adminId, { approval_status: 'approved' }, { new: true })
    if (!admin) return res.status(404).send({ status: false, message: 'Admin not found' })
    res.send({ status: true, message: 'Admin approved successfully' })
  } catch (e) {
    console.log(e)
    res.status(500).send({ status: false, message: 'Error approving admin' })
  }
}

const rejectAdmin = async (req, res) => {
  const adminId = req.params.id
  if (!mongoose.Types.ObjectId.isValid(adminId))
    return res.status(400).send({ status: false, message: 'Invalid admin id' })
  try {
    const admin = await adminModel.findByIdAndUpdate(adminId, { approval_status: 'rejected' }, { new: true })
    if (!admin) return res.status(404).send({ status: false, message: 'Admin not found' })
    res.send({ status: true, message: 'Admin rejected' })
  } catch (e) {
    console.log(e)
    res.status(500).send({ status: false, message: 'Error rejecting admin' })
  }
}

const forgotPasswordAdmin = async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).send({ status: false, message: 'Email is required' })
  try {
    const admin = await adminModel.findOne({ email })
    if (!admin) return res.status(404).send({ status: false, message: 'No account found with that email' })

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiry = new Date(Date.now() + 15 * 60 * 1000)

    await adminModel.findByIdAndUpdate(admin._id, { resetCode: code, resetCodeExpiry: expiry })

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

const resetPasswordAdmin = async (req, res) => {
  const { email, code, newPassword } = req.body
  if (!email || !code || !newPassword)
    return res.status(400).send({ status: false, message: 'All fields are required' })
  try {
    const admin = await adminModel.findOne({ email })
    if (!admin) return res.status(404).send({ status: false, message: 'Account not found' })
    if (!admin.resetCode || admin.resetCode !== code)
      return res.status(400).send({ status: false, message: 'Invalid reset code' })
    if (!admin.resetCodeExpiry || new Date() > admin.resetCodeExpiry)
      return res.status(400).send({ status: false, message: 'Reset code has expired. Please request a new one.' })
 
    const hashed = await bcrypt.hash(newPassword, 10)
    await adminModel.findByIdAndUpdate(admin._id, { password: hashed, resetCode: null, resetCodeExpiry: null }, { runValidators: false })
 
    res.send({ status: true, message: 'Password reset successfully' })
  } catch (e) {
    console.log(e)
    res.status(500).send({ status: false, message: e.message ?? 'Error resetting password' })
  }
}

const heartbeatAdmin = async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).send({ status: false, message: 'Missing token' })
  const token = authHeader.split(' ')[1]
  jwt.verify(token, process.env.JWT_SECRET || 'secret', async (err, decoded) => {
    if (err) return res.status(401).send({ status: false, message: 'Invalid token' })
    try {
      await adminModel.findByIdAndUpdate(decoded.id, { lastSeen: new Date() })
      res.send({ status: true })
    } catch (e) {
      res.status(500).send({ status: false })
    }
  })
}

const getOnlineUsers = async (req, res) => {
  const cutoff = new Date(Date.now() - 2 * 60 * 1000)
  try {
    const teacherModel  = require('../models/teachers.model')
    const studentsModel = require('../models/students.model')
    const fields = { firstname: 1, lastname: 1, email: 1, lastSeen: 1 }
    const [teachers, students, admins] = await Promise.all([
      teacherModel.find({ lastSeen: { $gte: cutoff } }, fields),
      studentsModel.find({ lastSeen: { $gte: cutoff } }, fields),
      adminModel.find({ lastSeen: { $gte: cutoff } }, fields),
    ])
    const online = [
      ...teachers.map(u => ({ ...u.toObject(), role: 'teacher' })),
      ...students.map(u => ({ ...u.toObject(), role: 'student' })),
      ...admins.map(u => ({ ...u.toObject(), role: 'admin' })),
    ].sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen))
    res.send({ status: true, online, count: online.length })
  } catch (e) {
    console.log(e)
    res.status(500).send({ status: false, message: 'Error fetching online users' })
  }
}

module.exports = {
  signupPageAdmin,
  registerAdmin,
  loginPageAdmin,
  loginAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getAdminDashboard,
  approveAdmin,
  rejectAdmin,
  forgotPasswordAdmin,
  resetPasswordAdmin,
  heartbeatAdmin,
  getOnlineUsers,
};