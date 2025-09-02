import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Worker setup (needed for pdfjs)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function App() {
  const [pdfName, setPdfName] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [summary, setSummary] = useState("");
  const [pageCount, setPageCount] = useState(null);
  const [keywords, setKeywords] = useState(null);
  const [preview, setPreview] = useState(null);

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfName(file.name);
      setPdfFile(file);

      // Reset outputs
      setAnswer("");
      setSummary("");
      setPageCount(null);
      setKeywords(null);
      setPreview(null);
    }
  };

  const handleAsk = () => {
    if (!question) return;
    setAnswer(`Here’s a sample answer for: "${question}"`);
  };

  const handleSummarize = () => {
    if (!pdfName) return;
    setSummary(`Summary for "${pdfName}" generated successfully!`);
  };

  const handlePageCount = async () => {
    if (!pdfFile) return;

    const reader = new FileReader();
    reader.onload = async function () {
      try {
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        setPageCount(pdf.numPages);
      } catch (err) {
        console.error("Error reading page count:", err);
        setPageCount("Error reading page count");
      }
    };
    reader.readAsArrayBuffer(pdfFile);
  };

  const handleKeywords = async () => {
    if (!pdfFile) return;

    const reader = new FileReader();
    reader.onload = async function () {
      try {
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;

        let textContent = "";
        const maxPages = Math.min(pdf.numPages, 5);
        for (let i = 1; i <= maxPages; i++) {
          const page = await pdf.getPage(i);
          const text = await page.getTextContent();
          textContent += text.items.map((item) => item.str).join(" ") + " ";
        }

        const words = textContent
          .toLowerCase()
          .replace(/[^a-z\s]/g, "")
          .split(/\s+/)
          .filter(
            (w) =>
              w.length > 3 &&
              ![
                "this",
                "that",
                "with",
                "from",
                "have",
                "there",
                "which",
                "will",
                "their",
                "about",
                "were",
                "when",
                "your",
                "them",
                "they",
                "been",
                "also",
                "into",
                "because",
                "these",
                "some",
              ].includes(w)
          );

        const freq = {};
        words.forEach((w) => {
          freq[w] = (freq[w] || 0) + 1;
        });

        const topWords = Object.entries(freq)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([word, count]) => `${word} (${count})`);

        setKeywords(topWords);
      } catch (err) {
        console.error("Error extracting keywords:", err);
        setKeywords(["Error extracting keywords"]);
      }
    };
    reader.readAsArrayBuffer(pdfFile);
  };

  const handlePreview = async () => {
    if (!pdfFile) return;

    const reader = new FileReader();
    reader.onload = async function () {
      try {
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;

        const page = await pdf.getPage(1);
        const text = await page.getTextContent();
        const previewText = text.items.map((item) => item.str).join(" ");

        setPreview(previewText.substring(0, 500) + "...");
      } catch (err) {
        console.error("Error extracting preview:", err);
        setPreview("Error extracting preview");
      }
    };
    reader.readAsArrayBuffer(pdfFile);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#f8f9fa",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "60%",
          background: "#c1d9f8",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <h1 style={{ color: "#333", margin: 0 }}>PDF Doubt Solver</h1>

        {/* File Upload */}
        <input
          type="file"
          accept="application/pdf"
          onChange={handlePdfUpload}
          style={{
            padding: "6px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            background: "#fff",
            width: "50%",
          }}
        />
        {pdfName && (
          <p style={{ fontSize: "14px", color: "#555", margin: 0 }}>
            Uploaded: <b>{pdfName}</b>
          </p>
        )}

        {/* Question box + Ask button */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            width: "50%",
            justifyContent: "center",
          }}
        >
          <input
            type="text"
            placeholder="Ask a question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />
          <button
            onClick={handleAsk}
            disabled={!pdfName}
            style={btnStyle("#66a6ff", pdfName)}
          >
            Ask
          </button>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={handleSummarize} disabled={!pdfName} style={btnStyle("#4caf50", pdfName)}>Summarize</button>
          <button onClick={handlePageCount} disabled={!pdfName} style={btnStyle("#673ab7", pdfName)}>Page Count</button>
          <button onClick={handleKeywords} disabled={!pdfName} style={btnStyle("#ff5722", pdfName)}>Keywords</button>
          <button onClick={handlePreview} disabled={!pdfName} style={btnStyle("#009688", pdfName)}>Preview</button>
        </div>

        {/* Output sections */}
        {summary && outputBox("Summary", summary)}
        {pageCount && outputBox("Page Count", pageCount)}
        {keywords && outputBox("Keywords", <ul>{keywords.map((k,i)=><li key={i}>{k}</li>)}</ul>)}
        {preview && outputBox("Preview", preview)}
        {answer && outputBox("Answer", answer)}
      </div>
    </div>
  );
}

// helper for button styling
const btnStyle = (color, enabled) => ({
  padding: "10px 20px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: enabled ? color : "#aaa",
  color: "#fff",
  fontWeight: "bold",
  cursor: enabled ? "pointer" : "not-allowed",
});

// helper for output boxes
const outputBox = (title, content) => (
  <div
    style={{
      marginTop: "10px",
      padding: "15px",
      background: "#f9f9f9",
      textAlign: "left",
      borderRadius: "8px",
      width: "80%",
      maxHeight: "200px",
      overflowY: "auto",
    }}
  >
    <h3 style={{ marginBottom: "10px", color: "#333" }}>{title}:</h3>
    <div>{content}</div>
  </div>
);

export default App;
