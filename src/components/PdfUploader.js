import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

const PdfUploader = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);

  // handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
    } else {
      alert("Please upload a valid PDF file");
    }
  };

  // load success
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload and Preview PDF</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />

      {pdfFile && (
        <div style={{ marginTop: "20px", overflow: "auto", height: "90vh" }}>
          <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={600} // adjust size
              />
            ))}
          </Document>
        </div>
      )}
    </div>
  );
};

export default PdfUploader;
