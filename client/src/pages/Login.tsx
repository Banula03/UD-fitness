import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const loginStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

  .login-root {
    min-height: 100vh;
    background: #0b0b0b;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Poppins', sans-serif;
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
    background: radial-gradient(circle, rgba(0, 242, 234, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  .login-root::after {
    content: '';
    position: absolute;
    bottom: -30%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(0, 242, 234, 0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  .login-card {
    width: 100%;
    max-width: 420px;
    padding: 48px 40px;
    background: #1a1a1a;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
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
    background: linear-gradient(90deg, #00f2ea, #00bfa5);
    border-radius: 20px 20px 0 0;
  }

  .login-logo {
    font-size: 2rem;
    font-weight: 900;
    margin-bottom: 2.5rem;
    letter-spacing: -1.5px;
    text-align: center;
    color: #fff;
  }

  .login-logo span {
    color: #00f2ea;
  }

  .login-eyebrow {
    font-size: 11px;
    letter-spacing: 4px;
    color: #00f2ea;
    text-transform: uppercase;
    margin-bottom: 8px;
    font-weight: 700;
  }

  .login-heading {
    font-size: 42px;
    color: #ffffff;
    line-height: 1;
    margin: 0 0 36px 0;
    font-weight: 800;
    letter-spacing: -1px;
  }

  .login-field {
    margin-bottom: 20px;
    position: relative;
  }

  .login-label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #888;
    margin-bottom: 8px;
  }

  .login-input {
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

  .login-input::placeholder {
    color: #333;
  }

  .login-input:focus {
    border-color: #00f2ea;
    box-shadow: 0 0 0 3px rgba(0, 242, 234, 0.1);
  }

  .login-btn {
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

  .login-btn:hover {
    background: #fff;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 242, 234, 0.2);
  }

  .login-btn:active {
    transform: translateY(0);
  }

  {/* Updated footer color in Login component below */}
  
  .login-footer {
    margin-top: 28px;
    text-align: center;
    font-size: 13px;
    color: #666;
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
    background: #272727;
  }

  .login-divider span {
    font-size: 11px;
    color: #333;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
`;

const Login = () => {
    const navigate = useNavigate();
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
            const { token, role, name, _id } = res.data;
            
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            localStorage.setItem("user", name);
            localStorage.setItem("userId", _id);
            
            alert("Login success");
            if (role === 'admin') {
                navigate('/admin-dashboard');
            } else if (role === 'trainer') {
                navigate('/trainer-dashboard');
            } else if (role === 'member') {
                navigate('/member-dashboard');
            } else {
                navigate('/');
            }
        } catch (err: any) {
            alert(err.response?.data?.message || "Invalid credentials");
        }
    };

    return (
        <>
            <style>{loginStyles}</style>
            <div className="login-root">
                <div className="login-card">
                    <div className="login-logo">UD<span> FITNESS STUDIO</span></div>
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
                        Don't have an account? <Link to="/register" style={{ color: "#00f2ea", fontWeight: 500 }}>Create one</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;