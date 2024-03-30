import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import defaultPdf from "../../1.pdf";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { getDownloadURL } from "@firebase/storage";
import { AppContext } from "../../Context/ContextProvider";

const PdfUploader = ({ firebaseLink }) => {
  const [file, setFile] = useState(null);
  const [downloadLink, setDownloadLink] = useState(null);

  const [title, setTitle] = useState("");
  const [imgUrl, setImgUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const { imgLink, seImgLink } = useContext(AppContext);

  useEffect(() => {
    setLoading();
  }, [imgUrl]);

  const savePdfDetails = async (details) => {
    try {
      await axios.post("http://localhost:5000/uploadpdf", details, {
        headers: {
          "Content-type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error saving PDF details:", error);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(selectedFile.name);

      setLoading(true); // Set loading state to true

      fileRef.put(selectedFile).then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log(downloadURL);

          setImgUrl(downloadURL);
          const link = imgUrl;
          setLoading(false); // Set loading state to false once URL is obtained

          // Save the PDF details to the backend with the link
          savePdfDetails({ title, pdf: selectedFile.name, link: downloadURL });
          // window.location.reload();
        });
      });
    } else {
      console.log("No file selected, so select one ");
    }
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const response = await axios.post(
        "http://localhost:5000/uploadpdf",
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

      // Fetch the updated list of PDFs
      await getPdf();
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  const showInNewTab = () => {
    if (imgUrl) {
      // Open a new tab with the provided PDF URL
      window.open(imgUrl, "_blank");
    } else {
      console.log("PDF URL is empty.");
    }
  };

  return (
    <div className="border p-2 gap-4 flex flex-col">
      <h1 className="font-bold text-2xl mx-auto underline">PDF Uploader</h1>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button
        className="border p-2 btn btn-warning"
        onChange={handleFileChange}
        onClick={handleUpload}
        disabled={!file}
      >
        Upload PDF
      </button>
      {imgUrl && (
        <div>
          <p>
            Modified PDF Download Link:{" "}
            <a
              className="btn btn-danger"
              href={imgUrl}
              target="_blank"
              download="modified_pdf.pdf"
            >
              Download
            </a>{" "}
          </p>
        </div>
      )}
    </div>
  );
};

export default PdfUploader;
