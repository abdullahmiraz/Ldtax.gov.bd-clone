import React, { useContext, useEffect, useRef } from "react";
import PdfComp from "../../PdfComp";
import { AppContext } from "../../Context/ContextProvider";
import { useReactToPrint } from "react-to-print";

const Print = () => {
  const componentRef = useRef();
  const { printPdf, setPrintPdf } = useContext(AppContext);

  useEffect(() => {
    setPrintPdf("c6QlhjS3Ow0KV0WbB2IT.pdf");
  }, []); // Run this effect only once when the component mounts

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const pdfUrl = `http://localhost:5000/updatedPDF/${printPdf}`;

  return (
    <div>
        <div className="flex flex-col items-center w-[90%] mx-auto border my-4">
        <div className=" w-full text-white p-2 bg-[#4B8DF8]">
          <p>ভূমি উন্নয়ন কর পরিশোধ রসিদ</p>
        </div>
        {/* <div className="pdf-popup" ref={componentRef}> */}
        <div className="pdf-popup">
          <PdfComp pdfFile={pdfUrl} />
        </div>
        <button
          type="button"
          onClick={() => {
            handlePrint();
            window.open(
              pdfUrl,
              "_blank",
              "noopener,noreferrer,width=full,height=full"
            );
          }}
          className="btn btn-md btn-success mt-4 bg-[#4B8DF8] text-white"
          target="_blank noopener"
          style={{ margin: "20px", padding: "10px" }}
        >
          প্রিন্ট
        </button>
      </div>
    </div>
  );
};

export default Print;
