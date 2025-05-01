// src/components/loginsignup/signup.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import "./signup.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [businessName, setBusinessName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword || !businessName) {
      return alert("Please fill all fields.");
    }

    if (password.length < 6) {
      return alert("Password must be 6+ characters.");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match.");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "businesses", userCredential.user.uid), {
        email,
        businessName,
        createdAt: new Date(),
      });
      window.location.href = "/";
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          alert("Email already in use.");
          break;
        case "auth/invalid-email":
          alert("Invalid email format.");
          break;
        case "auth/weak-password":
          alert("Password too weak.");
          break;
        default:
          alert("Signup error: " + error.message);
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2 className="signup-heading">Create your account</h2>
          <input
            type="text"
            placeholder="Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="signup-btn">SIGN UP</button>
        </form>
      </div>

      <div className="signup-right">
        <div className="login-box">
          <h3>Already have an account?</h3>
          <p>Sign in to access your account and manage your business.</p>
          <button className="login-btn" onClick={() => window.location.href='/'}>
            SIGN IN
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
