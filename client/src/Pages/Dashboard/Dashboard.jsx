import React, { useState } from "react";

const Dashboard = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");

  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    console.log(title, file);
  };

  return (
    <div>
      <h1>Admin dashboard</h1>
      <div className="input-files w-[40vw] border mx-auto m-4 p-4">
        <form action="" className="formStyle">
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
              className=" form-control  "
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
      </div>
    </div>
  );
};

export default Dashboard;
