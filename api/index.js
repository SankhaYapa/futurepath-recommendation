const express=require("express");
const app=express()
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const userRoute=require("./routes/users")
const authRoute=require("./routes/auth")
const courseRoute=require("./routes/courseroute")
const gigRoute = require("./routes/gigs");

const multer = require("multer");
const path = require("path");

dotenv.config()

mongoose.connect(process.env.MONGO_URL,() => {
    console.log("Connected to MongoDB");
  });
  
app.use("/images", express.static(path.join(__dirname, "public/images")));  
//middleware
app.use(express.json());
app.use(helmet())
app.use(morgan("common"))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/gig");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name); 
  },
});

const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully");
  } catch (error) {
    console.log(error);
  }
});
// app.get("/",(req,res)=>{
//     res.send("welcome")
// })
app.use("/api/users",userRoute)
app.use("/api/auth",authRoute)
app.use("/api/courseroute",courseRoute)
app.use("/api/gigs", gigRoute);

app.listen(8800,()=>{
    console.log("Backend server is running")
})