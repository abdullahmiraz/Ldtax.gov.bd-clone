import React, { useEffect, useState } from "react";
import axios from "axios";
import PdfComp from "../../PdfComp";
import { pdfjs } from "react-pdf";
import defaultPdf from "../../1.pdf";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { getDownloadURL } from "@firebase/storage";

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

  useEffect(() => {
    getPdf();
  }, []);

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
      }

      // Clear the form data
      setTitle("");
      setFile("");

      // Reset updateId
      setUpdateId(null);

      // Fetch the updated PDFs
      getPdf();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const showPdf = (pdf) => {
    setPdfFile(`http://localhost:5000/files/${pdf}`);
  };

  const deletePdf = async (id) => {
    try {
      const result = await axios.delete(
        `http://localhost:5000/delete-file/${id}`
      );

      if (result.data.status === "OK") {
        alert("PDF deleted successfully!");
        getPdf();
        // Reload the page after deleting the PDF
      }
      window.location.reload();
    } catch (error) {
      console.error("Error deleting file:", error);
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
          setLoading(false); // Set loading state to false once URL is obtained
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

  return (
    <div>
      <h1 className="font-bold text-5xl text-center m-8 p-4 border">
        Admin dashboard
      </h1>
      <div className="input-files w-[80vw] border mx-auto m-4 p-4">
        {/*  form here  */}
        <form
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
        </form>

        <div className="divider"></div>

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
                    onClick={() => showPdf(data?.pdf)}
                    className="btn btn-sm btn-primary mt-2 mx-2"
                  >
                    Show PDF
                  </button>
                  <button
                    onClick={showInNewTab}
                    className="btn btn-sm btn-primary mt-2 mx-2"
                    disabled={loading} // Disable the button when loading
                  >
                    {loading ? "Loading..." : "Show in new tab"}
                  </button>
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
      </div>

      {pdfFile && <PdfComp pdfFile={pdfFile} />}
    </div>
  );
};

export default Dashboard;
