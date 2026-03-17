import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const loginStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

  .login-root {
    min-height: 100vh;
    background: #0a0a0a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
  }

  .login-root::before {
    content: '';
    position: absolute;
    top: -40%;
    left: -20%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(255, 80, 40, 0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  .login-root::after {
    content: '';
    position: absolute;
    bottom: -30%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(255, 80, 40, 0.07) 0%, transparent 70%);
    pointer-events: none;
  }

  .login-card {
    width: 100%;
    max-width: 420px;
    padding: 48px 40px;
    background: #111111;
    border: 1px solid #1e1e1e;
    border-radius: 4px;
    position: relative;
    z-index: 1;
    box-shadow: 0 32px 64px rgba(0,0,0,0.5);
  }

  .login-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ff5028, #ff8c42);
    border-radius: 4px 4px 0 0;
  }

  .login-eyebrow {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 11px;
    letter-spacing: 4px;
    color: #ff5028;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .login-heading {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 52px;
    color: #ffffff;
    line-height: 1;
    margin: 0 0 36px 0;
    letter-spacing: 2px;
  }

  .login-field {
    margin-bottom: 20px;
    position: relative;
  }

  .login-label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #555;
    margin-bottom: 8px;
  }

  .login-input {
    width: 100%;
    background: #1a1a1a;
    border: 1px solid #272727;
    border-radius: 3px;
    padding: 14px 16px;
    color: #ffffff;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
  }

  .login-input::placeholder {
    color: #3a3a3a;
  }

  .login-input:focus {
    border-color: #ff5028;
    box-shadow: 0 0 0 3px rgba(255, 80, 40, 0.08);
  }

  .login-btn {
    width: 100%;
    padding: 15px;
    margin-top: 8px;
    background: linear-gradient(135deg, #ff5028 0%, #ff8c42 100%);
    border: none;
    border-radius: 3px;
    color: #ffffff;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    letter-spacing: 3px;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
  }

  .login-btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .login-btn:active {
    transform: translateY(0);
  }

  .login-footer {
    margin-top: 28px;
    text-align: center;
    font-size: 13px;
    color: #444;
  }

  .login-footer span {
    color: #ff5028;
    font-weight: 500;
    cursor: pointer;
  }

  .login-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 28px 0;
  }

  .login-divider::before,
  .login-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #1e1e1e;
  }

  .login-divider span {
    font-size: 11px;
    color: #333;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
`;

const Login = () => {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submit = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", form);
            localStorage.setItem("token", res.data.token);
            alert("Login success");
        } catch (err: any) {
            alert("Invalid credentials");
        }
    };

    return (
        <>
            <style>{loginStyles}</style>
            <div className="login-root">
                <div className="login-card">
                    <div className="login-eyebrow">Welcome back</div>
                    <h2 className="login-heading">Login</h2>

                    <div className="login-field">
                        <label className="login-label">Email Address</label>
                        <input
                            className="login-input"
                            name="email"
                            placeholder="you@example.com"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="login-field">
                        <label className="login-label">Password</label>
                        <input
                            className="login-input"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            onChange={handleChange}
                        />
                    </div>

                    <button className="login-btn" onClick={submit}>
                        Sign In
                    </button>

                    <div className="login-divider"><span>or</span></div>

                    {/* ✅ Updated footer link */}
                    <div className="login-footer">
                        Don't have an account? <Link to="/register" style={{ color: "#ff5028", fontWeight: 500 }}>Create one</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;