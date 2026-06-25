import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { loginUser } from "../services/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (localStorage.getItem("token")) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser({ email, password });

      localStorage.setItem("token", data.access_token);

      
      navigate("/");
    } catch {
      alert("Invalid Email or Password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-slate-100">
          Welcome Back
        </h1>

        <p className="text-center text-slate-400 mb-6">
          Login to FINXTIME
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-surface-muted border border-surface-border"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-surface-muted border border-surface-border"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            className="w-full bg-brand-500 py-3 rounded-lg font-semibold"
            type="submit"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-5 text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-brand-400 font-semibold"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
