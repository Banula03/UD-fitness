import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const registerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

  .register-root {
    min-height: 100vh;
    background: #0a0a0a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    position: relative;
    overflow: hidden;
    padding: 40px 20px;
    box-sizing: border-box;
  }

  .register-root::before {
    content: '';
    position: absolute;
    top: -30%;
    right: -15%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(255, 80, 40, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  .register-root::after {
    content: '';
    position: absolute;
    bottom: -20%;
    left: -10%;
    width: 450px;
    height: 450px;
    background: radial-gradient(circle, rgba(255, 140, 66, 0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .register-card {
    width: 100%;
    max-width: 440px;
    padding: 48px 40px;
    background: #111111;
    border: 1px solid #1e1e1e;
    border-radius: 4px;
    position: relative;
    z-index: 1;
    box-shadow: 0 32px 64px rgba(0,0,0,0.5);
  }

  .register-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ff8c42, #ff5028);
    border-radius: 4px 4px 0 0;
  }

  .register-eyebrow {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 11px;
    letter-spacing: 4px;
    color: #ff5028;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .register-heading {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 52px;
    color: #ffffff;
    line-height: 1;
    margin: 0 0 36px 0;
    letter-spacing: 2px;
  }

  .register-field {
    margin-bottom: 20px;
  }

  .register-label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #555;
    margin-bottom: 8px;
  }

  .register-input {
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

  .register-input::placeholder {
    color: #3a3a3a;
  }

  .register-input:focus {
    border-color: #ff5028;
    box-shadow: 0 0 0 3px rgba(255, 80, 40, 0.08);
  }

  .register-select {
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
    appearance: none;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23555' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
  }

  .register-select:focus {
    border-color: #ff5028;
    box-shadow: 0 0 0 3px rgba(255, 80, 40, 0.08);
  }

  .register-select option {
    background: #1a1a1a;
    color: #ffffff;
  }

  .role-hint {
    margin-top: 8px;
    font-size: 12px;
    color: #383838;
    line-height: 1.5;
  }

  .register-btn {
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

  .register-btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .register-btn:active {
    transform: translateY(0);
  }

  .register-footer {
    margin-top: 28px;
    text-align: center;
    font-size: 13px;
    color: #444;
  }

  .register-footer span {
    color: #ff5028;
    font-weight: 500;
    cursor: pointer;
  }

  .register-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 28px 0;
  }

  .register-divider::before,
  .register-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #1e1e1e;
  }

  .register-divider span {
    font-size: 11px;
    color: #333;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
`;

const Register = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "member"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submit = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/auth/register", form);
            alert("Registered Successfully");
            console.log(res.data);
        } catch (err: any) {
            alert(err.response?.data?.message);
        }
    };

    return (
        <>
            <style>{registerStyles}</style>
            <div className="register-root">
                <div className="register-card">
                    <div className="register-eyebrow">Join us today</div>
                    <h2 className="register-heading">Register</h2>

                    <div className="register-field">
                        <label className="register-label">Full Name</label>
                        <input
                            className="register-input"
                            name="name"
                            placeholder="John Doe"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="register-field">
                        <label className="register-label">Email Address</label>
                        <input
                            className="register-input"
                            name="email"
                            placeholder="you@example.com"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="register-field">
                        <label className="register-label">Password</label>
                        <input
                            className="register-input"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="register-field">
                        <label className="register-label">Role</label>
                        <select className="register-select" name="role" onChange={handleChange}>
                            <option value="admin">Admin</option>
                            <option value="trainer">Trainer</option>
                            <option value="staff">Staff</option>
                            <option value="member">Member</option>
                        </select>
                        <div className="role-hint">Members access workouts · Trainers manage sessions</div>
                    </div>

                    <button className="register-btn" onClick={submit}>
                        Create Account
                    </button>

                    <div className="register-divider"><span>or</span></div>

                    {/* ✅ Updated footer link */}
                    <div className="register-footer">
                        Already have an account? <Link to="/login" style={{ color: "#ff5028", fontWeight: 500 }}>Sign in</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;