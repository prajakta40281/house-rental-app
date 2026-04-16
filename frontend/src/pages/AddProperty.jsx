import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function AddProperty() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    size: "",
    rent: "",
  });

  const [images, setImages] = useState([]);
  const [checking, setChecking] = useState(true);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/property/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.verification?.status !== "VERIFIED") {
          alert("You must verify your identity before adding a property.");
          navigate("/verification");
        }
      } catch (err) {
        console.error("Auth check failed", err);
      } finally {
        setChecking(false);
      }
    };

    checkUserStatus();
  }, [navigate]);

  if (checking)
    return (
      <div className="flex items-center justify-center h-screen text-lg font-medium">
        Checking authorization...
      </div>
    );

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();

      data.append("title", form.title);
      data.append("location", form.location);
      data.append("size", form.size);
      data.append("rent", form.rent);

      for (let i = 0; i < images.length; i++) {
        data.append("images", images[i]);
      }

      await API.post("/property/add", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Property added");
      navigate("/dashboard");
    } catch (err) {
      console.error("Add failed", err);
      alert("Failed to add property");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-6 rounded-2xl shadow-md space-y-5"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Add New Property
        </h2>

        {/* Inputs */}
        <div className="space-y-3">
          <input
            name="title"
            placeholder="Property Title"
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="location"
            placeholder="Location"
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="size"
            placeholder="Size (e.g. 1200 sqft)"
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="rent"
            placeholder="Rent (₹)"
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">
            Upload Images
          </label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full border p-2 rounded-lg bg-gray-50"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-yellow-600 text-white py-3 rounded-xl font-medium hover:bg-yellow-500 transition"
        >
          Add Property
        </button>
      </form>
    </div>
  );
}

export default AddProperty;