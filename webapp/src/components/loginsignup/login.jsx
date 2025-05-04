// src/components/loginsignup/login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert("Fill in all fields.");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.replace("/dashboard");

    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          alert("User not found.");
          break;
        case "auth/wrong-password":
          alert("Wrong password.");
          break;
        case "auth/invalid-email":
          alert("Invalid email.");
          break;
        default:
          alert("Login error: " + error.message);
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <form className="login-form" onSubmit={handleLogin}>
          <h2 className="login-heading">Welcome To, Molale Admin Portal</h2>
          <input
            type="email"
            placeholder="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        
          <button type="submit" className="signin-btn">SIGN IN</button>
        </form>
      </div>

      <div className="login-right">
        <div className="signup-box">
          <h3>About</h3>
          <p>
        The Molale Admin Portal is a powerful web-based dashboard designed for management of doctors.
        Built for efficiency and control, it enables administrators to easily register and monitor doctors, handle reports, and 
        manage business or doctors data—all from one intuitive interface.
      </p>

        </div>
      </div>
    </div>
  );
};

export default Login;
