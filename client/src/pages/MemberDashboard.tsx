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
import ChatBox from '../components/ChatBox';
import { io } from 'socket.io-client';

const getUserId = () => {
  const id = localStorage.getItem('userId');
  if (id) return id;
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload).id;
    } catch (e) {
      console.error("JWT parsing error", e);
    }
  }
  return '';
};

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
  const [orders, setOrders] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requestText, setRequestText] = useState('');
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChatTrainer, setSelectedChatTrainer] = useState<any>(null);
  const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;
    const socket = io('http://localhost:5000');
    socket.emit("join_room", userId);

    socket.on("new_message_notification", (message: any) => {
      setUnreadCounts(prev => {
        // Ignore if we are currently chatting with this user
        if (selectedChatTrainer?._id === message.senderId) return prev;
        return {
          ...prev,
          [message.senderId]: (prev[message.senderId] || 0) + 1
        };
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedChatTrainer]);

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
      const userId = getUserId();
      if (!userId) return;
      
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [dashRes, mealRes, workoutRes, feedbackRes, requestRes, trainerRes, ordersRes] = await Promise.all([
        fetch('http://localhost:5000/api/member/dashboard', { headers }),
        fetch('http://localhost:5000/api/member/meal-plans', { headers }),
        fetch('http://localhost:5000/api/member/workout-plans', { headers }),
        fetch('http://localhost:5000/api/member/feedback', { headers }),
        fetch('http://localhost:5000/api/member/requests', { headers }),
        fetch('http://localhost:5000/api/member/trainers', { headers }),
        fetch(`http://localhost:5000/api/orders/member/${userId}`, { headers })
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

      if (ordersRes && ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data.data || []);
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
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>My Orders</button>
        <button className={activeTab === 'feedback' ? 'active' : ''} onClick={() => setActiveTab('feedback')}>Feedback</button>
        <button className={activeTab === 'requests' ? 'active' : ''} onClick={() => setActiveTab('requests')}>Messages</button>
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
            <div className="dashboard-section" style={{ marginTop: '2rem' }}>
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

        {activeTab === 'orders' && (
          <div className="orders-section dashboard-section">
            <h2><FaShoppingBag /> Order History</h2>
            <div className="orders-list">
              {orders.length > 0 ? orders.map(order => (
                <div key={order._id} className="order-item-card">
                  <div className="order-header">
                    <div>
                      <span className="order-id">ORDER #{order._id.slice(-6).toUpperCase()}</span>
                      <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span className={`status-badge ${order.status}`}>{order.status.toUpperCase()}</span>
                  </div>
                  
                  <div className="order-items-preview">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="order-item-line">
                        <span>{item.product_id?.name || "Product"} x {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="order-footer">
                    <span>Payment: {order.payment_method}</span>
                    <span className="order-total">Total: ${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              )) : <p>You haven't placed any orders yet.</p>}
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
          <div className="requests-section" style={{ display: 'flex', gap: '20px', background: 'var(--surface-dark)', padding: '20px', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
            <div className="chat-sidebar" style={{ width: '30%', borderRight: '1px solid var(--glass-border)', paddingRight: '10px' }}>
              <h2>Trainers</h2>
              <div className="trainers-list">
                {trainers.map(t => (
                  <div
                    key={t._id}
                    className={`trainer-chat-item ${selectedChatTrainer?._id === t._id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedChatTrainer(t);
                      setUnreadCounts(prev => ({ ...prev, [t._id]: 0 }));
                    }}
                    style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid var(--glass-border)', backgroundColor: selectedChatTrainer?._id === t._id ? 'rgba(0, 242, 234, 0.1)' : 'transparent', borderRadius: '5px', marginBottom: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <strong>{t.name}</strong>
                    {unreadCounts[t._id] > 0 && <span style={{ background: '#ff4757', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>+{unreadCounts[t._id]} new</span>}
                  </div>
                ))}
                {trainers.length === 0 && <p>No trainers available.</p>}
              </div>
            </div>
            <div className="chat-main" style={{ width: '70%' }}>
              {selectedChatTrainer ? (
                <ChatBox
                  currentUser={{ _id: getUserId(), name: localStorage.getItem('user') || 'Member' }}
                  contactUser={selectedChatTrainer}
                />
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', background: 'var(--bg-dark)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  Select a trainer to start chatting
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;
