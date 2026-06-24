import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { registerUser } from "../services/auth";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (localStorage.getItem("token")) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser({
      username,
      email,
      password,
    });

      
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-slate-100">
          Create Account
        </h1>

        <p className="text-center text-slate-400 mb-6">
          Start managing your finances smarter
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
           type="text"
           placeholder="Full Name"
           className="w-full p-3 rounded-lg bg-surface-muted border border-surface-border"
           value={username}
          onChange={(e) => setUsername(e.target.value)}
           required
          />

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
            Register
          </button>
        </form>

        <p className="text-center mt-5 text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-brand-400 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}