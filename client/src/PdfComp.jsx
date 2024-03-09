import { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";

function PdfComp(props) {
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    let element = document.querySelector(".react-pdf__message");
    if (element) {
      element.innerHTML = `<div>press any of the pdf file above to show any pdf file here</div>`;
    }
  }, []); // Empty dependency array ensures this effect runs once after initial render

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="pdf-div">
      <p>
        Page {pageNumber} of {numPages}
      </p>
      <Document file={props.pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
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
