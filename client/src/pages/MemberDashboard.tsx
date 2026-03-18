import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaShoppingCart,
  FaBox,
  FaDollarSign,
  FaUser,
  FaShoppingBag,
  FaClipboardList,
  FaUtensils,
  FaDumbbell,
  FaCommentAlt
} from 'react-icons/fa';
import './MemberDashboard.css';

const MemberDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSessions: 0,
    pendingRequests: 0,
    activePlans: 0
  });
  const [sessions, setSessions] = useState<any[]>([]);
  const [mealPlans, setMealPlans] = useState<any[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requestText, setRequestText] = useState('');
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const userName = localStorage.getItem('user');
    const userRole = localStorage.getItem('role');
    if (userName) {
      setUser({ name: userName, role: userRole });
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [dashRes, mealRes, workoutRes, feedbackRes, requestRes, trainerRes] = await Promise.all([
        fetch('http://localhost:5000/api/member/dashboard', { headers }),
        fetch('http://localhost:5000/api/member/meal-plans', { headers }),
        fetch('http://localhost:5000/api/member/workout-plans', { headers }),
        fetch('http://localhost:5000/api/member/feedback', { headers }),
        fetch('http://localhost:5000/api/member/requests', { headers }),
        fetch('http://localhost:5000/api/member/trainers', { headers })
      ]);

      if (dashRes.ok) {
        const dashData = await dashRes.json();
        setSessions(dashData.data.sessions || []);
        setStats({
          totalSessions: dashData.data.sessions.length,
          pendingRequests: dashData.data.stats.pendingRequestsCount,
          activePlans: dashData.data.stats.mealPlansCount + dashData.data.stats.workoutPlansCount
        });
      }

      if (mealRes.ok) {
        const data = await mealRes.json();
        setMealPlans(data.data || []);
      }

      if (workoutRes.ok) {
        const data = await workoutRes.json();
        setWorkoutPlans(data.data || []);
      }

      if (feedbackRes.ok) {
        const data = await feedbackRes.json();
        setFeedback(data.data || []);
      }

      if (requestRes.ok) {
        const data = await requestRes.json();
        setRequests(data.data || []);
      }

      if (trainerRes.ok) {
        const data = await trainerRes.json();
        setTrainers(data.data || []);
      }

    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestText.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/api/member/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          request_text: requestText,
          trainer_id: selectedTrainer 
        })
      });

      if (response.ok) {
        setRequestText('');
        setSelectedTrainer('');
        fetchDashboardData();
        alert('Request submitted successfully!');
      }
    } catch (err) {
      console.error('Failed to submit request:', err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="member-dashboard">
      <div className="dashboard-header">
        <h1>UD<span> FITNESS STUDIO</span></h1>
        <div className="user-welcome">Welcome back, {user?.name || 'Member'}!</div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Total Sessions</div>
              <div className="stat-value">{stats.totalSessions}</div>
            </div>
            <FaDumbbell className="stat-icon" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Pending Requests</div>
              <div className="stat-value">{stats.pendingRequests}</div>
            </div>
            <FaClipboardList className="stat-icon" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div>
              <div className="stat-label">Active Plans</div>
              <div className="stat-value">{stats.activePlans}</div>
            </div>
            <FaUtensils className="stat-icon" />
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={activeTab === 'plans' ? 'active' : ''} onClick={() => setActiveTab('plans')}>My Plans</button>
        <button className={activeTab === 'feedback' ? 'active' : ''} onClick={() => setActiveTab('feedback')}>Feedback</button>
        <button className={activeTab === 'requests' ? 'active' : ''} onClick={() => setActiveTab('requests')}>My Requests</button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="dashboard-section info-section">
              <h2><FaUser /> Account Information</h2>
              <div className="user-info">
                <div className="info-item">
                  <div className="info-label">Full Name</div>
                  <div className="info-value">{user?.name || 'N/A'}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Email</div>
                  <div className="info-value">{user?.email || localStorage.getItem('email') || 'N/A'}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Status</div>
                  <div className="info-value"><span className="status-badge active">{user?.status || 'Active'}</span></div>
                </div>
                <div className="info-item">
                  <div className="info-label">Role</div>
                  <div className="info-value">{user?.role || 'Member'}</div>
                </div>
              </div>
            </div>

            <div className="dashboard-section">
              <h2><FaDumbbell /> Scheduled Sessions</h2>
              <div className="sessions-list">
                {sessions.length > 0 ? sessions.map(s => (
                  <div key={s._id} className="session-item">
                    <div className="session-info">
                      <strong>{s.type.toUpperCase()}</strong>
                      <p>{s.session_date} at {s.session_time} ({s.duration} min)</p>
                    </div>
                    <span className="session-tag">Upcoming</span>
                  </div>
                )) : <p>No sessions scheduled.</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="plans-section">
             <div className="dashboard-section">
               <h2><FaUtensils /> Meal Plans</h2>
               <div className="plans-list">
                 {mealPlans.length > 0 ? mealPlans.map(p => (
                   <div key={p._id} className="plan-card">
                     <p>{p.plan_details}</p>
                     <small>Assigned on: {new Date(p.createdAt).toLocaleDateString()}</small>
                   </div>
                 )) : <p>No meal plans assigned yet.</p>}
               </div>
             </div>
             <div className="dashboard-section" style={{marginTop: '2rem'}}>
               <h2><FaDumbbell /> Workout Plans</h2>
               <div className="plans-list">
                 {workoutPlans.length > 0 ? workoutPlans.map(p => (
                   <div key={p._id} className="plan-card workout">
                     <p>{p.plan_details}</p>
                     <small>Assigned on: {new Date(p.createdAt).toLocaleDateString()}</small>
                   </div>
                 )) : <p>No workout plans assigned yet.</p>}
               </div>
             </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="feedback-section dashboard-section">
            <h2><FaCommentAlt /> Feedback from Trainers</h2>
            <div className="feedback-list">
              {feedback.length > 0 ? feedback.map(f => (
                <div key={f._id} className="feedback-item">
                  <p>"{f.content}"</p>
                  <small>Received: {new Date(f.createdAt).toLocaleDateString()}</small>
                </div>
              )) : <p>No feedback received yet.</p>}
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="requests-section">
            <div className="dashboard-section">
              <h2>Request a Plan</h2>
              <form className="request-form" onSubmit={handleRequestSubmit}>
                <div className="form-group" style={{marginBottom: '1rem'}}>
                  <label className="info-label">Select Trainer</label>
                  <select 
                    value={selectedTrainer} 
                    onChange={(e) => setSelectedTrainer(e.target.value)}
                    required
                  >
                    <option value="">-- Choose a Trainer --</option>
                    {trainers.map(t => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="info-label">Request Details</label>
                  <textarea 
                    placeholder="Tell your trainer what you need (e.g., 'I need a new weight loss routine')"
                    value={requestText}
                    onChange={(e) => setRequestText(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="action-btn-primary">Submit Request</button>
              </form>
            </div>

            <div className="dashboard-section" style={{marginTop: '2rem'}}>
              <h2>Request History</h2>
              <div className="requests-history">
                {requests.length > 0 ? requests.map(r => (
                  <div key={r._id} className="request-card-history">
                    <div className="request-main">
                      <p><strong>You:</strong> {r.request_text}</p>
                      {r.reply_text && <div className="trainer-reply"><strong>Trainer:</strong> {r.reply_text}</div>}
                    </div>
                    <span className={`status-badge ${r.status}`}>{r.status.toUpperCase()}</span>
                  </div>
                )) : <p>No requests made yet.</p>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;
