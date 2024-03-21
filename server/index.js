const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
// const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
app.use(express.json());
app.use(cors());
app.use("/updatedPDF", express.static("updatedPDF"));
const { PDFDocument } = require("pdf-lib");
const qrCode = require("qrcode");
const fs = require("fs");
require("./pdfDetails");
const port = process.env.PORT || 5000;
require("./pdfDetails");
const PdfSchema = mongoose.model("PdfDetails");

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
// !!! the code below is for the qr code file system which will save my file from the disSrorage to the updatedPDF ; but the above is for temporary

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./temp");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now();
//     cb(null, uniqueSuffix + file.originalname);
//   },
// });
const storage = multer.memoryStorage(); // Use memory storage to avoid saving the original file
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
    // Process the uploaded PDF in memory without saving the original file
    const pdfBuffer = req.file.buffer.toString("base64");
    const pdfDoc = await PDFDocument.load(Buffer.from(pdfBuffer, "base64"));

    // Generate a random string for the file name
    const randomText = generateRandomString(20);
    const qrText = `http://localhost:5000/updatedPDF/${randomText}`;
    const pageCount = pdfDoc.getPageCount();

    for (let i = 0; i < pageCount; i++) {
      const page = pdfDoc.getPage(i);
      const { width, height } = page.getSize();

      const qrDataUrl = await qrCode.toDataURL(qrText);
      const qrImage = await pdfDoc.embedPng(qrDataUrl);

      const qrWidth = 90;

      const qrHeight = 90;
      const centerX = (width - qrWidth) / 2;
      const centerY = (height - qrHeight) / 2 - height * 0.13;

      const qrImageDims = {
        x: centerX,
        y: centerY,
        width: qrWidth,
        height: qrHeight,
      };
      page.drawImage(qrImage, qrImageDims);
    }

    // Save the modified PDF to the "./updatedPDF" directory with a random file name
    const originalFileName = req.file.originalname;
    const randomFileName = `${randomText}.pdf`;
    const updatedPdfPath = `./updatedPDF/${randomFileName}`;
    fs.writeFileSync(updatedPdfPath, await pdfDoc.save());

    // Delete older files if the count exceeds 10, check check **** for later
    const files = fs.readdirSync("./updatedPDF");
    if (files.length > 100) {
      const oldestFiles = files
        .sort(
          (a, b) =>
            fs.statSync(`./updatedPDF/${a}`).mtime.getTime() -
            fs.statSync(`./updatedPDF/${b}`).mtime.getTime()
        )
        .slice(0, files.length - 10);
      oldestFiles.forEach((file) => fs.unlinkSync(`./updatedPDF/${file}`));

      const pdfDetails = new PdfDetails({
        title: originalFileName,
        pdf: randomFileName,
        link: req.body.link, // Assuming the Firebase link is sent in the request body
      });
      await pdfDetails.save();
    }

    res.status(200).send({
      message: "PDF successfully processed",
      originalFileName,
      randomFileName,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/get-random-string", (req, res) => {
  const randomText = generateRandomString(20);
  res.json({ randomText });
});

// qr code file system ends----------- here

// Get files
app.get("/get-files", async (req, res) => {
  try {
    const data = await PdfSchema.find().sort({ createdAt: -1 });
    res.send({ status: "OK", data: data });
  } catch (error) {
    res.json({ status: "error", error: error.message });
  }
});

app.get("/get-updated-files", async (req, res) => {
  try {
    const files = fs.readdirSync("./updatedPDF");
    // Sort files by creation time
    const sortedFiles = files
      .map((file) => ({
        name: file,
        createdAt: fs.statSync(`./updatedPDF/${file}`).birthtime,
      }))
      .sort((a, b) => b.createdAt - a.createdAt);
    res.send({ status: "OK", data: sortedFiles });
  } catch (error) {
    console.error("Error fetching updated files:", error);
    res.json({ status: "error", error: error.message });
  }
});

// Upload files
app.post("/upload-files", upload.single("file"), async (req, res) => {
  console.log(req.file);
  const title = req?.body?.title;
  const fileName = req?.file?.filename;

  try {
    const fileCount = await PdfSchema.countDocuments();

    if (fileCount > 6) {
      const oldestFile = await PdfSchema.findOne().sort({ createdAt: -1 });
      const filePath = `./updatedPDF/${oldestFile.pdf}`;
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

    const previousFilePath = `./updatedPDF/${existingPdf.pdf}`;
    await fs.unlink(previousFilePath);

    const newFileName = `${Date.now()}${req.file.originalname}`;
    const newFilePath = `./updatedPDF/${newFileName}`;
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
app.delete("/delete-file/:fileName", async (req, res) => {
  const fileName = req.params.fileName;

  try {
    const filePath = `./updatedPDF/${fileName}`;

    if (fs.existsSync(filePath)) {
      // Delete the file
      fs.unlinkSync(filePath);

      // Respond with success
      res.json({ status: "OK", data: { fileName } });
    } else {
      // File not found, respond with an error
      res.status(404).json({ status: "error", error: "PDF not found" });
    }
  } catch (error) {
    console.error("Error deleting PDF:", error);
    res.status(500).json({ status: "error", error: error.message });
  }
});

// app.delete("/delete-file/:id", async (req, res) => {
//   const fileId = req.params.id;

//   try {
//     const deletedPdf = await PdfSchema.findByIdAndDelete(fileId);

//     if (!deletedPdf) {
//       res.status(404).json({ status: "error", error: "PDF not found" });
//       return;
//     }

//     const filePath = `./updatedPDF/${deletedPdf.pdf}`;
//     await fs.unlink(filePath);

//     res.json({ status: "OK", data: deletedPdf });
//   } catch (error) {
//     console.error("Error deleting PDF:", error);
//     res.status(500).json({ status: "error", error: error.message });
//   }
// });

// test test tst
app.get("/", async (req, res) => {
  res.send("Success !!!");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// users authentication system adding here :

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v7wkgs9.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const userCollection = client.db("bistroDb").collection("users");

    // jwt related api
    // app.post("/jwt", async (req, res) => {
    //   const user = req.body;
    //   const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    //     expiresIn: "24h",
    //   });
    //   res.send({ token });
    // });

    // middlewares
    const verifyToken = (req, res, next) => {
      // console.log('inside verify token', req.headers.authorization);
      if (!req.headers.authorization) {
        return res.status(401).send({ message: "unauthorized access" });
      }
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: "unauthorized access" });
        }
        req.decoded = decoded;
        next();
      });
    };

    // use verify admin after verifyToken
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      const isAdmin = user?.role === "admin";
      if (!isAdmin) {
        return res.status(403).send({ message: "forbidden access" });
      }
      next();
    };

    // users related api
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;

      if (email !== req.decoded.email) {
        return res.status(403).send({ message: "forbidden access" });
      }

      const query = { email: email };
      const user = await userCollection.findOne(query);
      let admin = false;
      if (user) {
        admin = user?.role === "admin";
      }
      res.send({ admin });
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      // insert email if user doesnt exists:
      // you can do this many ways (1. email unique, 2. upsert 3. simple checking)
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exists", insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
