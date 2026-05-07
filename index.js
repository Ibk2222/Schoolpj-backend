
const express= require("express")
const app =express()
const ejs = require("ejs")
require("dotenv").config({ override: true });
const PORT = process.env.PORT 
const mongoose = require("mongoose")
const adminRoute = require("./routes/admin.route");
const studentRoute = require("./routes/students.route");
const teacherRoute = require("./routes/teacher.route");
const URI = process.env.MONGODB_URI
const cors = require("cors")

app.use(cors())
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use("/admin", adminRoute)
app.use("/students", studentRoute)
app.use("/teacher", teacherRoute)



// app.get('/login', (req, res) => {
//   res.render('login');
// });

// app.get('/', (req, res) => {
//   res.render('index');
// });

// app.get('/dashboard', (req, res) => {
//   res.render('dashboard');
// });


 






mongoose
  .connect(URI)
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("Database connection failed");
    console.log(error);
  });

let connections = app.listen(PORT, (err) => {
  if (err) {
    console.log("There is an error" + err);
  } else {
    console.log(`Server is running on Port ${PORT}`);
  }
});

let socketClient = require("socket.io")
let io = socketClient(connections, {
  cors: {origin: "*"}
})
io.on("connection", (socket)=>{
  console.log("A user connected successfully")
  // console.log(socket.id)
  socket.on("sendMsg", (message)=>{
    console.log(message)
    io.emit("broadcastMsg", message)
  })
  socket.on("disconnect user", ()=>{
    console.log("someone disconnected")
  })
})
