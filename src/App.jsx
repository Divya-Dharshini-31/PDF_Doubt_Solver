import { useState } from "react";

function App() {
  const [pdfName, setPdfName] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfName(file.name);
    }
  };

  const handleAsk = () => {
    if (!question) return;
    // Dummy answer for demo
    setAnswer(`Here’s a sample answer for: "${question}"`);
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
          boxSizing: "border-box",
          borderRadius: "12px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <h1 style={{ color: "#333", margin: 0 }}>PDF Doubt Solver</h1>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", width: "100%" }}>
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
        </div>

        <div style={{ display: "flex", gap: "10px", width: "50%", justifyContent: "center" }}>
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
              boxSizing: "border-box",
            }}
          />
          <button
            onClick={handleAsk}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#66a6ff",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Ask
          </button>
        </div>

        {answer && (
          <div
            style={{
              marginTop: "10px",
              padding: "15px",
              background: "#f9f9f9",
              textAlign: "left",
              borderRadius: "8px",
              width: "80%",
            }}
          >
            <h3 style={{ marginBottom: "10px", color: "#333" }}>Answer:</h3>
            <p style={{ margin: 0 }}>{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
