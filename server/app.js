const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const fs = require("fs").promises;

const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
app.use("/files", express.static("files"));

const port = process.env.PORT || 5000;

const mongoUrl = `mongodb+srv://tax-pdf-uploader:3LHvO5SeDVjpqiAR@cluster0.v7wkgs9.mongodb.net/tax-pdf-uploader?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((e) => console.log(e));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

require("./pdfDetails");
const PdfSchema = mongoose.model("PdfDetails");
const upload = multer({ storage: storage });

// get files
app.get("/get-files", async (req, res) => {
  try {
    // Retrieve data sorted by createdAt in descending order
    const data = await PdfSchema.find().sort({ createdAt: -1 });
    res.send({ status: "OK", data: data });
  } catch (error) {
    res.json({ status: "error", error: error.message });
  }
});

// upload files
app.post("/upload-files", upload.single("file"), async (req, res) => {
  console.log(req.file);
  const title = req.body.title;
  const fileName = req.file.filename;

  try {
    // Check file count
    const fileCount = await PdfSchema.countDocuments();

    // If file count exceeds 10, delete the oldest file
    if (fileCount > 6) {
      const oldestFile = await PdfSchema.findOne().sort({ createdAt: 1 });
      const filePath = `./files/${oldestFile.pdf}`;
      await Promise.all([
        PdfSchema.findByIdAndDelete(oldestFile._id),
        fs.unlink(filePath),
      ]);
    }

    // Save new file
    await PdfSchema.create({ title: title, pdf: fileName });
    res.send({ status: "OK" });
  } catch (error) {
    res.json({ status: "error", error: error.message });
  }
});

app.put("/update-file/:id", upload.single("file"), async (req, res) => {
  const fileId = req.params.id;
  const title = req.body.title;

  try {
    const existingPdf = await PdfSchema.findById(fileId);
    if (!existingPdf) {
      res.status(404).json({ status: "error", error: "PDF not found" });
      return;
    }

    // Remove previous file from storage
    const previousFilePath = `./files/${existingPdf.pdf}`;
    await fs.unlink(previousFilePath);

    // Upload new file
    const newFileName = `${Date.now()}${req.file.originalname}`;
    const newFilePath = `./files/${newFileName}`;
    await fs.rename(req.file.path, newFilePath);

    // Update the existing PDF with the new file
    const updatedPdf = await PdfSchema.findByIdAndUpdate(
      fileId,
      { title, pdf: newFileName },
      { new: true }
    );

    res.send({ status: "OK", data: updatedPdf });
  } catch (error) {
    console.error("Error updating PDF:", error);
    res.status(500).json({ status: "error", error: error.message });
  }
});

// Delete PDF
app.delete("/delete-file/:id", async (req, res) => {
  const fileId = req.params.id;

  try {
    const deletedPdf = await PdfSchema.findByIdAndDelete(fileId);

    if (!deletedPdf) {
      res.status(404).json({ status: "error", error: "PDF not found" });
      return;
    }

    // Remove the file from storage
    const filePath = `./files/${deletedPdf.pdf}`;
    await fs.unlink(filePath);

    res.json({ status: "OK", data: deletedPdf });
  } catch (error) {
    console.error("Error deleting PDF:", error);
    res.status(500).json({ status: "error", error: error.message });
  }
});

// Default route
app.get("/", async (req, res) => {
  res.send("Success !!!");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
