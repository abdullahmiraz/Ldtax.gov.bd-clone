const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.use("/files", express.static("files"));
const { PDFDocument } = require("pdf-lib");
const qrCode = require("qrcode");
const fs = require("fs");
const PdfDetails = require("./pdfDetails");
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

//  here is the upload to the qr code files:

const upload = multer({ storage: storage });

const generateRandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

app.post("/uploadpdf", upload.single("pdf"), async (req, res) => {
  try {
    const filePath = `./files/${req.file.filename}`;

    // Read the PDF file and convert it to base64
    const buffer = fs.readFileSync(filePath);
    const pdfBuffer = buffer.toString("base64");

    // Load the PDF document from base64
    const pdfDoc = await PDFDocument.load(Buffer.from(pdfBuffer, "base64"));

    const randomText = generateRandomString(20);
    const qrText = `https://ldtax.gov.bd/dakhila/${randomText}`;

    const pageCount = pdfDoc.getPageCount();

    for (let i = 0; i < pageCount; i++) {
      const page = pdfDoc.getPage(i);
      const { width, height } = page.getSize();

      const qrDataUrl = await qrCode.toDataURL(qrText);
      const qrImage = await pdfDoc.embedPng(qrDataUrl);

      const qrWidth = 70; // Adjust the size of the QR code as needed
      const qrHeight = 70;
      //   const qrHeight = qrWidth * (height / width);

      const centerX = (width - qrWidth) / 2;
      const centerY = (height - qrHeight) / 2 - height * 0.12;

      const qrImageDims = {
        x: centerX,
        y: centerY,
        width: qrWidth,
        height: qrHeight,
      };
      page.drawImage(qrImage, qrImageDims);
    }

    const modifiedPdfBytes = await pdfDoc.save();

    // Save the modified PDF to a local directory named "updatedPDF"
    const outputPath = "./updatedPDF/";
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath);
    }

    // const outputFilePath = `${outputPath}modified_pdf_${Date.now()}.pdf`;
    const outputFilePath = `${outputPath}${randomText}.pdf`;
    fs.writeFileSync(outputFilePath, modifiedPdfBytes);

    res.status(200).send({ downloadLink: outputFilePath });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// qr code file system ends here

// Get files
app.get("/get-files", async (req, res) => {
  try {
    const data = await PdfSchema.find().sort({ createdAt: -1 });
    res.send({ status: "OK", data: data });
  } catch (error) {
    res.json({ status: "error", error: error.message });
  }
});

// Upload files
app.post("/upload-files", upload.single("file"), async (req, res) => {
  console.log(req.file);
  const title = req.body.title;
  const fileName = req?.file?.filename;

  try {
    const fileCount = await PdfSchema.countDocuments();

    if (fileCount > 6) {
      const oldestFile = await PdfSchema.findOne().sort({ createdAt: 1 });
      const filePath = `./files/${oldestFile.pdf}`;
      await Promise.all([
        PdfSchema.findByIdAndDelete(oldestFile._id),
        fs.unlink(filePath),
      ]);
    }

    const newPdf = await PdfSchema.create({ title: title, pdf: fileName });

    const downloadURL = req.body.link;
    newPdf.link = downloadURL;
    await newPdf.save();

    res.send({ status: "OK" });
  } catch (error) {
    res.json({ status: "error", error: error.message });
  }
});

// Update PDF file
app.put("/update-file/:id", upload.single("file"), async (req, res) => {
  const fileId = req.params.id;
  const title = req.body.title;

  try {
    const existingPdf = await PdfSchema.findById(fileId);
    if (!existingPdf) {
      res.status(404).json({ status: "error", error: "PDF not found" });
      return;
    }

    const previousFilePath = `./files/${existingPdf.pdf}`;
    await fs.unlink(previousFilePath);

    const newFileName = `${Date.now()}${req.file.originalname}`;
    const newFilePath = `./files/${newFileName}`;
    await fs.rename(req.file.path, newFilePath);

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
