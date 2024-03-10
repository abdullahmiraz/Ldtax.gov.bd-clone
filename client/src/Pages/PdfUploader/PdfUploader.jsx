import React, { useState } from "react";
import axios from "axios";

const PdfUploader = () => {
  const [file, setFile] = useState(null);
  const [downloadLink, setDownloadLink] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const response = await axios.post(
        "http://localhost:5000/uploadpdf",  // Use the correct server route
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "arraybuffer",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setDownloadLink(url);
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  return (
    <div>
      <h1>PDF Uploader</h1>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file}>
        Upload PDF
      </button>
      {downloadLink && (
        <div>
          <p>Modified PDF Download Link:</p>
          <a href={downloadLink} download="modified_pdf.pdf">
            Download Modified PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default PdfUploader;
