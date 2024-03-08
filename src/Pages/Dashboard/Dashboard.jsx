import React from "react";

const Dashboard = () => {
  return (
    <div>
      <h1>Admin dashboard</h1>
      <div className="input-files">
        <div className="uploadfile">
          <input
            type="file"
            className="file-input file-input-bordered  file-input-xs w-full max-w-xs"
          />
        </div>
        <div className="editfile">
          <input
            type="file"
            className="file-input file-input-bordered  file-input-xs w-full max-w-xs"
          />
        </div>
        <div className="deletefile">
          <input
            type="file"
            className="file-input file-input-bordered  file-input-xs w-full max-w-xs"
          />
        </div>
        <div className="viewfile">
          <input
            type="file"
            className="file-input file-input-bordered  file-input-xs w-full max-w-xs"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
