import axios from "axios";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import React, { useContext, useEffect, useState } from "react";
import { pdfjs } from "react-pdf";
import { AppContext } from "../../Context/ContextProvider";
import PdfComp from "../../PdfComp";
import PdfUploader from "../PdfUploader/PdfUploader";
import { useNavigate } from "react-router-dom";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const Dashboard = () => {
  const [title, setTitle] = useState(""); 
  const [allImage, setAllImage] = useState(null); 
  const [imgUrl, setImgUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatedFiles, setUpdatedFiles] = useState([]);
  const { printPdf, setPrintPdf } = useContext(AppContext); 

  console.log(printPdf);

  useEffect(() => {
    getPdf();
    setSelectedPdf(printPdf);
  }, [printPdf]);

  const getPdf = async () => {
    try {
      const result = await axios.get("http://localhost:5000/get-files");
      setAllImage(result.data.data);
    } catch (error) {
      console.error("Error fetching PDFs:", error);
    }
  };

  const deletePdf = async (file) => {
    try {
      setLoading(true);

      // Send a request to the server to delete the PDF
      const response = await fetch(
        `http://localhost:5000/delete-file/${file}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.status === "OK") {
        // Handle success, e.g., update the state or fetch the updated files
        console.log("PDF deleted successfully");
      } else {
        // Handle error, e.g., show an error message
        console.error("Error deleting PDF:", data.error);
      }
      window.location.reload();
    } catch (error) {
      console.error("Error deleting PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  //   firebase fire upload here

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(selectedFile.name);

      setLoading(true); // Set loading state to true

      fileRef
        .put(selectedFile)
        .then((snapshot) => {
          snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log(downloadURL);

            // Update state with the download URL directly
            setImgUrl(downloadURL);
            setLoading(false); // Set loading state to false once URL is obtained

            // Save the PDF details to the backend with the link
            savePdfDetails({
              title,
              pdf: selectedFile.name,
              link: downloadURL,
            });
          });
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          setLoading(false); // Set loadin state to false in case of error
        });
    } else {
      console.log("No file selected, so select one ");
    }
  };

  // Function to save PDF details to the backend
  const savePdfDetails = async (details) => {
    try {
      await axios.post("http://localhost:5000/upload-files", details, {
        headers: {
          "Content-type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error saving PDF details:", error);
    }
  };
  const [selectedPdf, setSelectedPdf] = useState(null);
  const navigate = useNavigate();

  const openPdfInNewWindow = (pdf) => {
    console.log("Dashboard: ", pdf);

    // Set the selectedPdf in the context
    setPrintPdf(pdf);

    navigate(`/updatedPDF/${pdf}`);
  };

  return (
    <div>
      <h1 className="font-bold text-5xl text-center m-8 p-4 border">
        Admin dashboard
      </h1>
      <div className="input-files w-[80vw] border mx-auto m-4 p-4">
        {/* show the updated pdf from here  */}
        <div className="uploaded flex flex-col justify-center items-center text-center font-bold">
          <h4>Uploaded PDF: {allImage ? allImage.length : 0}</h4>

          <div className="output-div flex flex-wrap w-full gap-2">
            {allImage &&
              allImage.map((data) => (
                <div
                  key={data._id}
                  className="inner-div m-4 border p-2 rounded-md"
                >
                  <h6>Title: {data?.title} </h6>
                  <p>
                    Upload Time: {new Date(data.createdAt).toLocaleString()}
                  </p>

                  <button
                    onClick={() => deletePdf(data._id)}
                    className="btn btn-sm btn-danger mt-2 mx-2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleUpdate(data._id, data.title)}
                    className="btn btn-sm btn-warning mt-2 mx-2"
                  >
                    Update
                  </button>
                </div>
              ))}
          </div>
        </div>
        <div className="divider"></div>

        <PdfUploader
          firebaseLink={imgUrl}
          handleFileUpload={handleFileUpload}
        />

        <div className="uploaded flex flex-col justify-center items-center text-center font-bold">
          <h4>Uploaded PDF: {updatedFiles ? updatedFiles.length : 0}</h4>

          <div className="output-div gap-2">
            {updatedFiles &&
              updatedFiles.map((file, index) => (
                <div
                  key={file.name + index}
                  className="inner-div m-4 border p-2 rounded-`md"
                >
                  <h6>File Name: {file.name}</h6>
                  <h5>Original Created At: {file.createdAt}</h5>
                  <button
                    onClick={() => openPdfInNewWindow(file.name)}
                    className="btn btn-sm btn-primary mt-2 mx-2"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "View"}
                  </button>

                  <button
                    onClick={() => deletePdf(file.name)}
                    className="btn btn-sm btn-secondary mt-2 mx-2"
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
