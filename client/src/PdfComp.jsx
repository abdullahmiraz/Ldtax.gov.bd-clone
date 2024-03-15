import { useState, useEffect, useContext } from "react";
import { Document, Page } from "react-pdf";
import { useLocation } from "react-router-dom";
import { AppContext } from "./Context/ContextProvider";

function PdfComp({ pdfFile }) {
  const [selectedPdf, setSelectedPdf] = useState();
  const { printPdf, setPrintPdf } = useContext(AppContext);
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const pageName = useLocation();
  console.log("PDF Comp: ", printPdf);

  useEffect(() => {
    let element = document.querySelector(".react-pdf__message");

    if (element) {
      element.innerHTML = `<div>press any of the pdf file above to show any pdf file here</div>`;
    }
  }, [printPdf]); // Empty dependency array ensures this effect runs once after initial render

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  return (
    <div className="pdf-div bg-transparent ">
      {console.log(printPdf)}
      <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.apply(null, Array(numPages))
          .map((x, i) => i + 1)
          .map((page) => {
            return (
              <Page
                className={`react-pdf__Document`}
                key={numPages % 1}
                pageNumber={page}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            );
          })}
      </Document>
    </div>
  );
}

export default PdfComp;
