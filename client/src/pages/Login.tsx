import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";

const loginStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  .login-root {
    min-height: 100vh;
    background: #080808;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow: hidden;
    padding: 20px;
  }

  .login-root::before {
    content: '';
    position: absolute;
    top: -40%;
    left: -20%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(0, 242, 234, 0.07) 0%, transparent 70%);
    pointer-events: none;
  }

  .login-root::after {
    content: '';
    position: absolute;
    bottom: -30%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(0, 242, 234, 0.04) 0%, transparent 70%);
    pointer-events: none;
  }

  .login-card {
    width: 100%;
    max-width: 420px;
    padding: 48px 40px;
    background: #111;
    border: 1px solid #1e1e1e;
    border-radius: 24px;
    position: relative;
    z-index: 1;
    box-shadow: 0 32px 80px rgba(0,0,0,0.6);
  }

  .login-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--role-accent, linear-gradient(90deg, #00f2ea, #00bfa5));
    border-radius: 24px 24px 0 0;
  }

  .login-logo {
    font-size: 1.2rem;
    font-weight: 900;
    margin-bottom: 2rem;
    letter-spacing: -0.5px;
    text-align: center;
    color: #fff;
  }

  .login-logo span { color: #00f2ea; }

  .login-role-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: var(--role-bg, rgba(0,242,234,0.08));
    color: var(--role-color, #00f2ea);
    border: 1px solid var(--role-border, rgba(0,242,234,0.2));
    padding: 6px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  .login-heading {
    font-size: 36px;
    color: #ffffff;
    line-height: 1.1;
    margin: 0 0 32px 0;
    font-weight: 900;
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
    color: #555;
    margin-bottom: 8px;
  }

  .login-input {
    width: 100%;
    background: #0a0a0a;
    border: 1px solid #222;
    border-radius: 12px;
    padding: 14px 16px;
    color: #ffffff;
    font-family: inherit;
    font-size: 15px;
    box-sizing: border-box;
    transition: all 0.3s;
    outline: none;
  }

  .login-input::placeholder { color: #2a2a2a; }

  .login-input:focus {
    border-color: var(--role-color, #00f2ea);
    box-shadow: 0 0 0 3px var(--role-glow, rgba(0,242,234,0.1));
  }

  .login-btn {
    width: 100%;
    padding: 15px;
    margin-top: 8px;
    background: var(--role-color, #00f2ea);
    border: none;
    border-radius: 12px;
    color: #000;
    font-weight: 800;
    font-size: 15px;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.3s;
    font-family: inherit;
  }

  .login-btn:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 10px 30px var(--role-glow, rgba(0,242,234,0.25));
  }

  .login-btn:active { transform: translateY(0); }

  .login-footer {
    margin-top: 28px;
    text-align: center;
    font-size: 13px;
    color: #444;
  }

  .login-back {
    display: block;
    margin-top: 16px;
    text-align: center;
    font-size: 12px;
    color: #333;
    text-decoration: none;
    transition: color 0.2s;
  }

  .login-back:hover { color: #00f2ea; }

  .login-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0;
  }

  .login-divider::before,
  .login-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #1a1a1a;
  }

  .login-divider span {
    font-size: 11px;
    color: #2a2a2a;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .login-error {
    background: rgba(255, 71, 87, 0.1);
    border: 1px solid rgba(255, 71, 87, 0.3);
    color: #ff4757;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 13px;
    margin-bottom: 20px;
    text-align: center;
  }
`;

const roleConfig: Record<string, { label: string; icon: string; color: string; bg: string; border: string; glow: string; gradient: string }> = {
  admin: {
    label: "Admin",
    icon: "🛡️",
    color: "#f39c12",
    bg: "rgba(243,156,18,0.08)",
    border: "rgba(243,156,18,0.25)",
    glow: "rgba(243,156,18,0.2)",
    gradient: "linear-gradient(90deg, #f39c12, #e67e22)",
  },
  trainer: {
    label: "Trainer",
    icon: "🏋️",
    color: "#00f2ea",
    bg: "rgba(0,242,234,0.08)",
    border: "rgba(0,242,234,0.25)",
    glow: "rgba(0,242,234,0.2)",
    gradient: "linear-gradient(90deg, #00f2ea, #00bfa5)",
  },
  member: {
    label: "Member",
    icon: "👤",
    color: "#a29bfe",
    bg: "rgba(162,155,254,0.08)",
    border: "rgba(162,155,254,0.25)",
    glow: "rgba(162,155,254,0.2)",
    gradient: "linear-gradient(90deg, #a29bfe, #6c5ce7)",
  },
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useParams<{ role?: string }>();
  const config = roleConfig[role || ""] || roleConfig["member"];

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

    const submit = async () => {
        if (!form.email || !form.password) {
            setError("Please enter your email and password.");
            return;
        }
        setLoading(true);
        try {
            const loginData = {
                email: form.email.trim(),
                password: form.password,
                role: role // role from useParams
            };
            const res = await axios.post("http://localhost:5000/api/auth/login", loginData);
            const { token, role: userRole, name, _id } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", userRole);
      localStorage.setItem("user", name);
      localStorage.setItem("userId", _id);

      const from = (location.state as any)?.from;
      if (from) {
        navigate(from);
      } else if (userRole === "admin") {
        navigate("/admin-dashboard");
      } else if (userRole === "trainer") {
        navigate("/trainer-dashboard");
      } else if (userRole === "member") {
        navigate("/member-dashboard");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") submit();
  };

  const cssVars = {
    "--role-color": config.color,
    "--role-bg": config.bg,
    "--role-border": config.border,
    "--role-glow": config.glow,
    "--role-accent": config.gradient,
  } as React.CSSProperties;

  return (
    <>
      <style>{loginStyles}</style>
      <div className="login-root" style={cssVars}>
        <div className="login-card">
          <div className="login-logo">UD<span> FITNESS STUDIO</span></div>

          <div className="login-role-badge">
            {config.icon} &nbsp;{config.label} Login
          </div>
          <h2 className="login-heading">Welcome Back</h2>

          {error && <div className="login-error">{error}</div>}

          <div className="login-field">
            <label className="login-label">Email Address</label>
            <input
              className="login-input"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              className="login-input"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button className="login-btn" onClick={submit} disabled={loading}>
            {loading ? "Signing in..." : `Sign In as ${config.label}`}
          </button>

          <div className="login-divider"><span>or</span></div>

          <div className="login-footer">
            Don't have an account?{" "}
            <Link to="/register" style={{ color: config.color, fontWeight: 600 }}>Create one</Link>
          </div>

          <a className="login-back" href="/login">← Choose a different role</a>
        </div>
      </div>
    </>
  );
};

export default Login;