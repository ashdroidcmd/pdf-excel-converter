import { useState } from "react";
import './App.css'

function App() {
  const [file, setFile] = useState(null);
  const [responseType, setResponseType] = useState("json");
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setOutput(null);

    try {
      const response = await fetch(`https://pdf-to-excel-python-production.up.railway.app/convert?response_type=${responseType}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Conversion failed");

      if (responseType === "json") {
        const data = await response.json();
        setOutput(JSON.stringify(data, null, 2));
      } else {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "converted.xlsx";
        a.click();
      }
    } catch (err) {
      setOutput("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">PDF to Excel Converter</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full border p-2"
        />
        <select
          value={responseType}
          onChange={(e) => setResponseType(e.target.value)}
          className="border p-2"
        >
          <option value="excel">Excel</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Converting..." : "Convert"}
        </button>
      </form>

      {output && (
        <pre className="mt-4 p-4 bg-gray-100 border rounded whitespace-pre-wrap text-sm max-h-96 overflow-auto">
          {output}
        </pre>
      )}
    </div>
    </>
  )
}

export default App
