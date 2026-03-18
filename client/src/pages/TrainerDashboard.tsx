import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TrainerDashboard.css';

function TrainerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Data states
  const [sessions, setSessions] = useState<any[]>([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [members, setMembers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);

  // Form states
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [sessionData, setSessionData] = useState({ member_id: '', session_date: '', session_time: '', duration: '60', type: 'personal' });
  const [leaveData, setLeaveData] = useState({ start_date: '', end_date: '', reason: '' });
  const [planData, setPlanData] = useState({ member_id: '', plan_details: '', type: 'meal' }); // type can be 'meal' or 'workout'
  const [feedbackData, setFeedbackData] = useState({ member_id: '', content: '' });
  const [replyData, setReplyData] = useState({ requestId: '', reply_text: '' });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    await Promise.all([
      fetchSessions(),
      fetchMemberCount(),
      fetchMembers(),
      fetchRequests(),
      fetchLeaves()
    ]);
    setLoading(false);
  };

  const fetchSessions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/trainer/sessions', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSessions(data.data || []);
      }
    } catch (err) { console.error(err); }
  };

  const fetchMemberCount = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/trainer/members-count', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTotalMembers(data.data?.count || 0);
      }
    } catch (err) { console.error(err); }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/trainer/members', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMembers(data.data || []);
      }
    } catch (err) { console.error(err); }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/trainer/requests', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRequests(data.data || []);
      }
    } catch (err) { console.error(err); }
  };

  const fetchLeaves = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/trainer/leave', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLeaves(data.data || []);
      }
    } catch (err) { console.error(err); }
  };

  const handleSessionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/trainer/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(sessionData)
      });
      if (response.ok) {
        setSuccessMsg('Session scheduled!');
        fetchSessions();
        setShowSessionForm(false);
        setSessionData({ member_id: '', session_date: '', session_time: '', duration: '60', type: 'personal' });
      }
    } catch (err) { setError('Failed to schedule session'); }
  };

  const handleLeaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/trainer/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(leaveData)
      });
      if (response.ok) {
        setSuccessMsg('Leave request submitted!');
        fetchLeaves();
        setLeaveData({ start_date: '', end_date: '', reason: '' });
      }
    } catch (err) { setError('Failed to submit leave'); }
  };

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = planData.type === 'meal' ? 'meal-plan' : 'workout-plan';
    try {
      const response = await fetch(`http://localhost:5000/api/trainer/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ member_id: planData.member_id, plan_details: planData.plan_details })
      });
      if (response.ok) {
        setSuccessMsg(`${planData.type === 'meal' ? 'Meal' : 'Workout'} plan assigned!`);
        setPlanData({ member_id: '', plan_details: '', type: 'meal' });
      }
    } catch (err) { setError('Failed to assign plan'); }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/trainer/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(feedbackData)
      });
      if (response.ok) {
        setSuccessMsg('Feedback submitted!');
        setFeedbackData({ member_id: '', content: '' });
      }
    } catch (err) { setError('Failed to submit feedback'); }
  };

  const handleReplySubmit = async (requestId: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/trainer/requests/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ requestId, reply_text: replyData.reply_text })
      });
      if (response.ok) {
        setSuccessMsg('Reply sent!');
        fetchRequests();
        setReplyData({ requestId: '', reply_text: '' });
      }
    } catch (err) { setError('Failed to send reply'); }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return <div className="trainer-loading">Loading...</div>;

  return (
    <div className="trainer-dashboard">
      <div className="trainer-header">
        <h1>UD<span> FITNESS STUDIO</span></h1>
        <div className="header-actions">
           <span className="trainer-name">Welcome, {localStorage.getItem('user') || 'Trainer'}</span>
           <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="trainer-tabs">
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={activeTab === 'requests' ? 'active' : ''} onClick={() => setActiveTab('requests')}>Member Requests</button>
        <button className={activeTab === 'plans' ? 'active' : ''} onClick={() => setActiveTab('plans')}>Diet & Workout</button>
        <button className={activeTab === 'leave' ? 'active' : ''} onClick={() => setActiveTab('leave')}>Leave Requests</button>
        <button className={activeTab === 'feedback' ? 'active' : ''} onClick={() => setActiveTab('feedback')}>Feedback</button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {successMsg && <div className="success-message">{successMsg}</div>}

      <div className="trainer-content">
        {activeTab === 'overview' && (
          <>
            <div className="trainer-stats">
              <div className="stat-card"><h3>Total Sessions</h3><p className="stat-value">{sessions.length}</p></div>
              <div className="stat-card"><h3>Active Members</h3><p className="stat-value">{totalMembers}</p></div>
              <div className="stat-card"><h3>Rating</h3><p className="stat-value">4.8/5</p></div>
            </div>
            <div className="sessions-section">
              <div className="section-header">
                <h2>My Training Sessions</h2>
                <button className="add-btn" onClick={() => setShowSessionForm(!showSessionForm)}>{showSessionForm ? 'Cancel' : 'Schedule Session'}</button>
              </div>
              {showSessionForm && (
                <form className="session-form" onSubmit={handleSessionSubmit}>
                  <div className="form-grid">
                    <select value={sessionData.member_id} onChange={(e) => setSessionData({...sessionData, member_id: e.target.value})} required>
                      <option value="">Select Member</option>
                      {members.map(m => <option key={m._id} value={m._id}>{m.name} ({m.email})</option>)}
                    </select>
                    <input type="date" value={sessionData.session_date} onChange={(e) => setSessionData({...sessionData, session_date: e.target.value})} required />
                    <input type="time" value={sessionData.session_time} onChange={(e) => setSessionData({...sessionData, session_time: e.target.value})} required />
                    <select value={sessionData.duration} onChange={(e) => setSessionData({...sessionData, duration: e.target.value})}>
                      <option value="30">30 min</option><option value="60">60 min</option><option value="90">90 min</option>
                    </select>
                  </div>
                  <button type="submit" className="submit-btn">Schedule</button>
                </form>
              )}
              <div className="sessions-list">
                {sessions.map((s: any) => (
                  <div key={s._id} className="session-card">
                    <h4>{s.type.toUpperCase()}</h4>
                    <p><span>Member:</span> {members.find(m => m._id === s.member_id)?.name || s.member_id}</p>
                    <p><span>Date:</span> {s.session_date} at {s.session_time}</p>
                    <span className="session-status">Scheduled</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'requests' && (
          <div className="requests-section">
            <h2>Member Inquiries</h2>
            <div className="requests-list">
              {requests.map((r: any) => (
                <div key={r._id} className="request-card">
                  <p><strong>From:</strong> {members.find(m => m._id === r.member_id)?.name || r.member_id}</p>
                  <p><strong>Question:</strong> {r.request_text}</p>
                  {r.status === 'replied' ? (
                    <div className="reply-box"><strong>Reply:</strong> {r.reply_text}</div>
                  ) : (
                    <div className="reply-form">
                      <textarea placeholder="Type your reply..." onChange={(e) => setReplyData({requestId: r._id, reply_text: e.target.value})}></textarea>
                      <button onClick={() => handleReplySubmit(r._id)}>Send Reply</button>
                    </div>
                  )}
                </div>
              ))}
              {requests.length === 0 && <p>No member requests found.</p>}
            </div>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="plans-section">
            <h2>Assign Plans</h2>
            <form className="plan-form" onSubmit={handlePlanSubmit}>
              <div className="form-grid">
                <select value={planData.member_id} onChange={(e) => setPlanData({...planData, member_id: e.target.value})} required>
                  <option value="">Select Member</option>
                  {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                </select>
                <select value={planData.type} onChange={(e) => setPlanData({...planData, type: e.target.value})}>
                  <option value="meal">Meal Plan</option>
                  <option value="workout">Workout Plan</option>
                </select>
              </div>
              <textarea placeholder="Enter details..." value={planData.plan_details} onChange={(e) => setPlanData({...planData, plan_details: e.target.value})} required></textarea>
              <button type="submit" className="submit-btn">Assign Plan</button>
            </form>
          </div>
        )}

        {activeTab === 'leave' && (
          <div className="leave-section">
            <h2>Leave Management</h2>
            <form className="leave-form" onSubmit={handleLeaveSubmit}>
              <div className="form-grid">
                <input type="date" value={leaveData.start_date} onChange={(e) => setLeaveData({...leaveData, start_date: e.target.value})} required />
                <input type="date" value={leaveData.end_date} onChange={(e) => setLeaveData({...leaveData, end_date: e.target.value})} required />
              </div>
              <textarea placeholder="Reason for leave..." value={leaveData.reason} onChange={(e) => setLeaveData({...leaveData, reason: e.target.value})} required></textarea>
              <button type="submit" className="submit-btn">Apply for Leave</button>
            </form>
            <div className="leaves-list" style={{marginTop:'2rem'}}>
              <h3>Previous Requests</h3>
              {leaves.map((l: any) => (
                <div key={l._id} className="leave-card">
                  <p><strong>Dates:</strong> {l.start_date} to {l.end_date}</p>
                  <p><strong>Reason:</strong> {l.reason}</p>
                  <span className={`status ${l.status}`}>{l.status.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="feedback-section">
            <h2>Send Feedback to Member</h2>
            <form className="feedback-form" onSubmit={handleFeedbackSubmit}>
              <select value={feedbackData.member_id} onChange={(e) => setFeedbackData({...feedbackData, member_id: e.target.value})} required>
                <option value="">Select Member</option>
                {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>
              <textarea placeholder="Enter feedback..." value={feedbackData.content} onChange={(e) => setFeedbackData({...feedbackData, content: e.target.value})} required></textarea>
              <button type="submit" className="submit-btn">Submit Feedback</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrainerDashboard;
