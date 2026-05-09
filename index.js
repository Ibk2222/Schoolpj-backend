const express= require("express")
const app =express()
const ejs = require("ejs")
require("dotenv").config({ override: true });
const PORT = process.env.PORT || 3000
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

mongoose
  .connect(URI)
  .then(async () => {
    console.log("Database connected");
    const staleIndexes = ['class_name_1', 'name_1'];
    for (const idx of staleIndexes) {
      try {
        await mongoose.connection.collection('classes').dropIndex(idx);
        console.log(`Dropped stale index: ${idx}`);
      } catch (e) {
        if (e.codeName !== 'IndexNotFound') console.log(`dropIndex ${idx}:`, e.message);
      }
    }
    try {
      await mongoose.connection.collection('tests').dropIndex('test_name_1');
      console.log('Dropped stale index: test_name_1');
    } catch (e) {
      if (e.codeName !== 'IndexNotFound') console.log('dropIndex test_name_1:', e.message);
    }
    try {
      await mongoose.connection.collection('results').dropIndex('name_1_subject_1');
      console.log('Dropped stale index: name_1_subject_1');
    } catch (e) {
      if (e.codeName !== 'IndexNotFound') console.log('dropIndex name_1_subject_1:', e.message);
    }
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
  socket.on("sendMsg", (message)=>{
    console.log(message)
    io.emit("broadcastMsg", message)
  })
  socket.on("disconnect", ()=>{
    console.log("someone disconnected")
  })
})
