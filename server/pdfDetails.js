const mongoose = require("mongoose");

const pdfDetailsSchema = new mongoose.Schema(
  {
    pdf: String,
    title: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "PdfDetails",
    timestamps: true, // Automatically add 'createdAt' and 'updatedAt'
  }
);

mongoose.model("PdfDetails", pdfDetailsSchema);
