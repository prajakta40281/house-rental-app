import { useState } from "react";
import API from "../services/api";
import Input from "../components/Input";
import Button from "../components/Button";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/signin", form);
      localStorage.setItem("token", res.data.token);
      window.location.href = "/";
    } catch (err) {
     console.error("Login failed", err);
     if (err.response && err.response.data && err.response.data.message) {
    alert(err.response.data.message); 
  } else {
    alert("Something went wrong");
  }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md border border-gray-100">
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <div className="pt-2">
            <Button type="submit">Login</Button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Login;