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
  const [file, setFile] = useState("");
  const [allImage, setAllImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [updateId, setUpdateId] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatedFiles, setUpdatedFiles] = useState([]);
  const { printPdf, setPrintPdf } = useContext(AppContext);
  // fetch the api data of printPdf using context api for copilot

  console.log(printPdf);

  const getUpdatedFiles = async () => {
    try {
      const result = await axios.get("http://localhost:5000/get-updated-files");
      const sortedFiles = result.data.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setUpdatedFiles(sortedFiles);
    } catch (error) {
      console.error("Error fetching updated files:", error);
    }
  };

  useEffect(() => {
    getPdf();
    getUpdatedFiles(); // Add this line
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

  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title || file.name); // Use filename if title is empty
    formData.append("file", file);

    try {
      if (updateId) {
        // Update existing PDF
        const result = await axios.put(
          `http://localhost:5000/update-file/${updateId}`,
          formData,
          {
            headers: {
              "Content-type": "multipart/form-data",
            },
          }
        );
      } else {
        // New submission
        const result = await axios.post(
          "http://localhost:5000/upload-files",
          formData,
          {
            headers: {
              "Content-type": "multipart/form-data",
            },
          }
        );
 
        await getPdf();
        setTitle("");
        setFile("");

        // Reset updateId
        setUpdateId(null);

        document.getElementById("fileInput").value = "";

        // Delete previous files if count exceeds 10
        if (updatedFiles.length > 10) {
          const filesToDelete = updatedFiles.slice(0, updatedFiles.length - 10);
          filesToDelete.forEach(async (file) => {
            await deletePdf(file.currentFilename);
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const showPdf = (pdf) => {
    setPdfFile(`http://localhost:5000/files/${pdf}`);
  };

  // const deletePdf = async (id) => {
  //   try {
  //     const result = await axios.delete(
  //       `http://localhost:5000/delete-file/${id}`
  //     );

  //     if (result.data.status === "OK") {
  //       alert("PDF deleted successfully!");
  //       getPdf();
  //       // Reload the page after deleting the PDF
  //     }
  //     window.location.reload();
  //   } catch (error) {
  //     console.error("Error deleting file:", error);
  //   }
  // };
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
  const handleUpdate = (id, title) => {
    setUpdateId(id);
    setTitle(title);
    // Reload the page after deleting the PDF
    // window.location.reload();
  };

  //   firebase fire upload here

  const handleFileUpload = (event) => {
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
          savePdfDetails({ title, pdf: selectedFile.name, link });
        });
      });
    } else {
      console.log("No file selected, so select one ");
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

    // Redirect to the App component with the pdfId parameter
    navigate(`/updatedPDF/${pdf}`);
    
  };
  // const openPdfInNewWindow = (pdf) => {
  //   console.log("Dashboard: ", pdf);

  //   setSelectedPdf(pdf);
  //   setPrintPdf(pdf);

  //   // Update the selectedPdf value in the context
  //   //  change this line whenever you want to show the pdf in the popup
  //   const newWindow = window.open(
  //     `http://localhost:5000/updatedPDF/${pdf}`,
  //     "_blank"
  //     // "noopener,noreferrer"
  //   );

  //   if (newWindow) {
  //     newWindow.moveTo(0, 0);
  //     newWindow.resizeTo(screen.width, screen.height);
  //   } else {
  //     console.error("Failed to open new window.");
  //   }
  // };

  return (
    <div>
      <h1 className="font-bold text-5xl text-center m-8 p-4 border">
        Admin dashboard
      </h1>
      <div className="input-files w-[80vw] border mx-auto m-4 p-4">
        {/*  form here  */}
        {/* <form
          onSubmit={submitImage}
          onChange={handleFileUpload}
          className="formStyle"
        >
          <h3>Upload, edit, delete pdf</h3> <br />
          <div className="uploadfile">
            <input
              type="text"
              className="form-control w-full"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />{" "}
            <br />
            <input
              type="file"
              id="fileInput"
              className="form-control"
              accept="application/pdf"
              required
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>{" "}
          <br />
          <button className="btn btn-primary" type="submit">
            {updateId ? "Update" : "Submit"}
          </button>
        </form> */}
        {/* show pdf ui here  */}
        {/* <div className="divider"></div> */}

        {/* <div className="divider"></div> */}
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
                  {/* <button
                    onClick={() => showPdf(data?.pdf)}
                    className="btn btn-sm btn-primary mt-2 mx-2"
                  >
                    Show PDF
                  </button> */}
                  {/* <button
                    onClick={showInNewTab}
                    className="btn btn-sm btn-primary mt-2 mx-2"
                    disabled={loading} // Disable the button when loading
                  >
                    {loading ? "Loading..." : "Show in new tab"}
                  </button> */}
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
        {/* show the updated pdf from here  */}
        <PdfUploader firebaseLink={imgUrl}></PdfUploader>
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
                  {/* Added this line */}
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

        {/* <TestContext link={printPdf}></TestContext> */}
        {selectedPdf && (
          <div className="pdf-popup">
            <PdfComp pdfFile={`http://localhost:5000/updatedPDF/${printPdf}`} />
            <button onClick={() => setSelectedPdf(null)}>Close</button>
          </div>
        )}
        {/* <Print link={printPdf}></Print> */}
      </div>

      {/* {pdfFile && <PdfComp pdfFile={pdfFile} />} */}
    </div>
  );
};

export default Dashboard;
