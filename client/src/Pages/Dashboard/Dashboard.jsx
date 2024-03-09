import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [allImage, setallImage] = useState(null);

  useEffect(() => {
    getPdf();
  }, []);

  const getPdf = async () => {
    const result = await axios.get(`http://localhost:5000/get-files`);
    console.log(result.data.data);
    setallImage(result.data.data);
  };

  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    console.log(title, file);

    try {
      const result = await axios.post(
        "http://localhost:5000/upload-files",
        formData,
        {
          headers: {
            "Content-type": "multipart/form-data",
          },
        }
      );
      console.log(result);
      if (result.data.status == "ok") {
        alert("Uploaded Successfully!!!");
        getPdf();
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const showPdf = (pdf) => {
    window.open(`http://localhost:5000/files/${pdf}`, "_blank", "norefferer");
  };

  return (
    <div>
      <h1>Admin dashboard</h1>
      <div className="input-files w-[80vw] border mx-auto m-4 p-4">
        <form onSubmit={submitImage} className="formStyle">
          <h3>Upload, edit, delete pdf</h3> <br />
          <div className="uploadfile">
            <input
              type="text"
              className="form-control w-full"
              placeholder="Title"
              required
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
            Submit
          </button>
        </form>

        <div className="divider"></div>

        {/* for showing the pdf that are on the database */}
        <div className="uploaded flex flex-col justify-center items-center text-center font-bold">
          <h4>Uploaded PDF: </h4>
          <div className="output-div">
            {allImage == null
              ? ""
              : allImage.map((data) => {
                  return (
                    <div id={data._id} className="inner-div">
                      <h6>Title: </h6>
                      <button
                        onClick={() => showPdf(data.pdf)}
                        className="btn btn-sm btn-primary"
                      >
                        Show PDF
                      </button>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
