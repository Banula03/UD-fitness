import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const registerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

  .register-root {
    min-height: 100vh;
    background: #0b0b0b;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Poppins', sans-serif;
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
    background: radial-gradient(circle, rgba(0, 242, 234, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  .register-root::after {
    content: '';
    position: absolute;
    bottom: -20%;
    left: -10%;
    width: 450px;
    height: 450px;
    background: radial-gradient(circle, rgba(0, 242, 234, 0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  .register-card {
    width: 100%;
    max-width: 440px;
    padding: 48px 40px;
    background: #1a1a1a;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
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
    background: linear-gradient(90deg, #00f2ea, #00bfa5);
    border-radius: 20px 20px 0 0;
  }

  .register-logo {
    font-size: 2rem;
    font-weight: 900;
    margin-bottom: 2.5rem;
    letter-spacing: -1.5px;
    text-align: center;
    color: #fff;
  }

  .register-logo span {
    color: #00f2ea;
  }

  .register-eyebrow {
    font-size: 11px;
    letter-spacing: 4px;
    color: #00f2ea;
    text-transform: uppercase;
    margin-bottom: 8px;
    font-weight: 700;
  }

  .register-heading {
    font-size: 42px;
    color: #ffffff;
    line-height: 1;
    margin: 0 0 36px 0;
    font-weight: 800;
    letter-spacing: -1px;
  }

  .register-field {
    margin-bottom: 20px;
  }

  .register-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #888;
    margin-bottom: 8px;
  }

  .register-input, .register-select {
    width: 100%;
    background: #0b0b0b;
    border: 1px solid #272727;
    border-radius: 12px;
    padding: 14px 16px;
    color: #ffffff;
    font-family: inherit;
    font-size: 15px;
    box-sizing: border-box;
    transition: all 0.3s;
    outline: none;
  }

  .register-input:focus, .register-select:focus {
    border-color: #00f2ea;
    box-shadow: 0 0 0 3px rgba(0, 242, 234, 0.1);
  }

  .register-select {
    appearance: none;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2300f2ea' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
  }

  .register-btn {
    width: 100%;
    padding: 15px;
    margin-top: 8px;
    background: #00f2ea;
    border: none;
    border-radius: 12px;
    color: #000;
    font-weight: 800;
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.3s;
  }

  .register-btn:hover {
    background: #fff;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 242, 234, 0.2);
  }

  .register-footer {
    margin-top: 28px;
    text-align: center;
    font-size: 13px;
    color: #888;
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
    background: #272727;
  }

  .register-divider span {
    font-size: 11px;
    color: #444;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
`;

const Register = () => {
    const navigate = useNavigate();
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
            navigate("/login");
        } catch (err: any) {
            alert(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <>
            <style>{registerStyles}</style>
            <div className="register-root">
                <div className="register-card">
                    <div className="register-logo">UD<span> FITNESS STUDIO</span></div>
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
                        Already have an account? <Link to="/login" style={{ color: "#00f2ea", fontWeight: 500 }}>Sign in</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;