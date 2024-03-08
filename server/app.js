const express = require("express");

const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());

const port = process.env.PORT || 5000;

const mongoUrl = `mongodb+srv://tax-pdf-uploader:3LHvO5SeDVjpqiAR@cluster0.v7wkgs9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to database");
  })
  .catch((e) => console.log(e));
// multer =============================================

const multer = require("multer");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/tmp/my-uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

app.post("upload-files", upload.single("file"), async (req, res) => {
  console.log(req.file);
});

// apis ----------------------------------------

app.get("/", async (req, res) => {
  res.send("success !!!");
});

app.listen(port, () => {
  console.log("server started");
});
