import React from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  .role-root {
    min-height: 100vh;
    background: #080808;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow: hidden;
    padding: 20px;
  }

  .role-root::before {
    content: '';
    position: absolute;
    top: -30%;
    left: -20%;
    width: 700px;
    height: 700px;
    background: radial-gradient(circle, rgba(0, 242, 234, 0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .role-root::after {
    content: '';
    position: absolute;
    bottom: -20%;
    right: -10%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(0, 180, 216, 0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  .role-logo {
    font-size: 1.4rem;
    font-weight: 900;
    color: #fff;
    letter-spacing: -0.5px;
    margin-bottom: 48px;
    z-index: 1;
  }

  .role-logo span {
    color: #00f2ea;
  }

  .role-heading {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 4px;
    color: #00f2ea;
    text-transform: uppercase;
    margin-bottom: 12px;
    z-index: 1;
  }

  .role-title {
    font-size: 42px;
    font-weight: 900;
    color: #fff;
    text-align: center;
    margin: 0 0 12px 0;
    letter-spacing: -1.5px;
    z-index: 1;
  }

  .role-subtitle {
    font-size: 15px;
    color: #555;
    margin: 0 0 52px 0;
    z-index: 1;
    text-align: center;
  }

  .role-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    z-index: 1;
    width: 100%;
    max-width: 820px;
  }

  @media (max-width: 640px) {
    .role-grid { grid-template-columns: 1fr; max-width: 360px; }
    .role-title { font-size: 28px; }
  }

  .role-card {
    background: #111;
    border: 1px solid #1e1e1e;
    border-radius: 20px;
    padding: 40px 28px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .role-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--accent);
    transform: scaleX(0);
    transition: transform 0.3s ease;
    border-radius: 20px 20px 0 0;
  }

  .role-card:hover::before { transform: scaleX(1); }

  .role-card:hover {
    border-color: var(--accent);
    transform: translateY(-6px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 30px var(--glow);
    background: #161616;
  }

  .role-icon {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: var(--accent-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    transition: transform 0.3s ease;
  }

  .role-card:hover .role-icon { transform: scale(1.1); }

  .role-name {
    font-size: 22px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.5px;
  }

  .role-desc {
    font-size: 13px;
    color: #555;
    text-align: center;
    line-height: 1.6;
  }

  .role-arrow {
    margin-top: 8px;
    font-size: 20px;
    color: var(--accent);
    font-weight: 700;
    opacity: 0;
    transform: translateX(-8px);
    transition: all 0.3s ease;
  }

  .role-card:hover .role-arrow {
    opacity: 1;
    transform: translateX(0);
  }

  .role-back {
    margin-top: 36px;
    font-size: 13px;
    color: #444;
    cursor: pointer;
    z-index: 1;
    text-decoration: none;
    transition: color 0.2s;
  }

  .role-back:hover { color: #00f2ea; }
`;

const roles = [
  {
    key: "admin",
    name: "Admin",
    icon: "🛡️",
    desc: "Manage staff, trainers, members, analytics and system settings.",
    accent: "#f39c12",
    glow: "rgba(243,156,18,0.15)",
    accentBg: "rgba(243,156,18,0.1)",
  },
  {
    key: "trainer",
    name: "Trainer",
    icon: "🏋️",
    desc: "Manage sessions, workout plans, meal plans and member requests.",
    accent: "#00f2ea",
    glow: "rgba(0,242,234,0.12)",
    accentBg: "rgba(0,242,234,0.08)",
  },
  {
    key: "member",
    name: "Member",
    icon: "👤",
    desc: "View your plans, sessions, feedback and shop for products.",
    accent: "#a29bfe",
    glow: "rgba(162,155,254,0.12)",
    accentBg: "rgba(162,155,254,0.08)",
  },
];

const RoleSelect: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{styles}</style>
      <div className="role-root">
        <div className="role-logo">UD<span> FITNESS STUDIO</span></div>
        <div className="role-heading">Welcome Back</div>
        <h1 className="role-title">Login as...</h1>
        <p className="role-subtitle">Select your role to continue to your dashboard</p>

        <div className="role-grid">
          {roles.map((role) => (
            <div
              key={role.key}
              className="role-card"
              style={{ "--accent": role.accent, "--glow": role.glow, "--accent-bg": role.accentBg } as React.CSSProperties}
              onClick={() => navigate(`/login/${role.key}`)}
            >
              <div className="role-icon">{role.icon}</div>
              <div className="role-name">{role.name}</div>
              <div className="role-desc">{role.desc}</div>
              <div className="role-arrow">→</div>
            </div>
          ))}
        </div>

        <a className="role-back" href="/">← Back to Home</a>
      </div>
    </>
  );
};

export default RoleSelect;
