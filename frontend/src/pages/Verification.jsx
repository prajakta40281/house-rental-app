import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Verification() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a document.");

    const formData = new FormData();
    formData.append("document", file);

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await API.post("/property/verify", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Verification successful!");
      navigate("/add-property"); // Send them back to complete their listing
    } catch (err) {
      console.error(err);
      alert("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-2">Identity Verification</h2>
        <p className="text-gray-600 mb-6">
          To ensure safety on Rentify, please upload a clear photo of your ID or Aadhaar card.
        </p>

        <form onSubmit={handleVerify}>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500 mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 disabled:bg-gray-400"
          >
            {loading ? "Uploading..." : "Verify & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Verification;