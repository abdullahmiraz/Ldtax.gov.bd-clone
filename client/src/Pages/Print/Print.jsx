import React, { useContext, useEffect, useRef, useState } from "react";
import PdfComp from "../../PdfComp";
import { useReactToPrint } from "react-to-print";
import { AppContext } from "../../Context/ContextProvider";

const Print = ({ link }) => {
  const componentRef = useRef();
  const [loading, setLoading] = useState(false);
  const { printPdf, setPrintPdf } = useContext(AppContext);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    if (printPdf) {
      setSelectedPdf(printPdf);
    }
    console.log(printPdf + " from print");
  }, [printPdf]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <div className="flex flex-col items-center w-[90%] mx-auto border rounded-md my-4">
        <div className=" w-full text-white p-2 border  bg-[#4B8DF8]">
          <p>ভূমি উন্নয়ন কর পরিশোধ রসিদ</p>
        </div>
        {selectedPdf ? (  
          <div className="pdf-popup" ref={componentRef}>
            <PdfComp pdfFile={`http://localhost:5000/updatedPDF/${link}`} />{" "}
          </div>
        ) : (
          <div>Loading PDF ...</div>
        )}
        <button
          type="button"
          onClick={handlePrint}
          className="btn btn-md btn-success mt-4 bg-[#4B8DF8] text-white"
          style={{ margin: "20px", padding: "10px" }}
        >
          প্রিন্ট
        </button>
      </div>
    </div>
  );
};

export default Print;
