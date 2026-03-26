import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

const COLORS = ['#00f2ea', '#ff4757', '#f39c12', '#2ecc71'];

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_members: 0,
    total_revenue: 0,
    active_staff: 0,
    monthly_growth: 12.5
  });
  const [analytics, setAnalytics] = useState<any>({
    revenueTimeline: [],
    memberActivity: [],
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.data || analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data.data || stats);
      } else {
        console.warn('Could not fetch stats, using defaults');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Use default stats
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('user_type');
    navigate('/login');
  };

  if (loading) return <div className="admin-loading">Loading Dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>UD<span> FITNESS STUDIO</span></h1>
        <div className="header-actions">
          <span className="admin-name">Welcome, Admin</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'staff' ? 'active' : ''}`}
          onClick={() => setActiveTab('staff')}
        >
          Staff Management
        </button>
        <button
          className={`tab-btn ${activeTab === 'trainers' ? 'active' : ''}`}
          onClick={() => setActiveTab('trainers')}
        >
          Trainers
        </button>
        <button
          className={`tab-btn ${activeTab === 'revenue' ? 'active' : ''}`}
          onClick={() => setActiveTab('revenue')}
        >
          Revenue
        </button>
        <button
          className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`}
          onClick={() => setActiveTab('members')}
        >
          Members
        </button>
        <button
          className={`tab-btn ${activeTab === 'leave' ? 'active' : ''}`}
          onClick={() => setActiveTab('leave')}
        >
          Leave Requests
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h2>Dashboard Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Members</h3>
                <p className="stat-value">{stats?.total_members || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Total Revenue</h3>
                <p className="stat-value">${(stats?.total_revenue || 0).toFixed(2)}</p>
              </div>
              <div className="stat-card">
                <h3>Active Staff</h3>
                <p className="stat-value">{stats?.active_staff || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Monthly Growth</h3>
                <p className="stat-value">{stats?.monthly_growth || 0}%</p>
              </div>
            </div>

            <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginTop: '30px' }}>

              <div className="chart-card" style={{ background: 'var(--surface-dark)', padding: '20px', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                <h3 style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>Revenue (Last 30 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.revenueTimeline}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="date" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip contentStyle={{ backgroundColor: '#2d3436', border: '1px solid #00f2ea', color: '#fff' }} />
                    <Line type="monotone" dataKey="revenue" stroke="#00f2ea" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card" style={{ background: 'var(--surface-dark)', padding: '20px', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
                <h3 style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>Member Status</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.memberActivity}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {analytics.memberActivity.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#2d3436', border: 'none', borderRadius: '5px', color: '#fff' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card" style={{ background: 'var(--surface-dark)', padding: '20px', borderRadius: '10px', border: '1px solid var(--glass-border)', gridColumn: '1 / -1' }}>
                <h3 style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>Top Selling Products</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.topProducts}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip contentStyle={{ backgroundColor: '#2d3436', border: 'none', borderRadius: '5px', color: '#fff' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Bar dataKey="sold" fill="#f39c12" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'staff' && <StaffManagement />}
        {activeTab === 'trainers' && <TrainerManagement />}
        {activeTab === 'revenue' && <RevenueTracking />}
        {activeTab === 'members' && <MembersManagement />}
        {activeTab === 'leave' && <LeaveManagement />}
        {activeTab === 'orders' && <OrderManagement />}
        {activeTab === 'settings' && <Settings />}
      </div>
    </div>
  );
}

function LeaveManagement() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/leave', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRequests(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/leave/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        setMessage(`Leave request ${status} successfully!`);
        fetchLeaveRequests();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) return <div className="section-loading">Loading leave requests...</div>;

  return (
    <div className="leave-section">
      <div className="section-header">
        <h2>Leave Requests</h2>
      </div>

      {message && <div className="success-message" style={{ marginBottom: '20px', color: 'var(--accent-teal)' }}>{message}</div>}

      <div className="data-list">
        {requests.length === 0 ? (
          <p className="no-data">No leave requests found</p>
        ) : (
          requests.map((req) => (
            <div key={req._id} className="data-card">
              <h4>Trainer: {req.trainer_id?.name || 'Unknown User'}</h4>
              <p><span>Dates:</span> {new Date(req.startDate).toLocaleDateString()} to {new Date(req.endDate).toLocaleDateString()}</p>
              <p><span>Reason:</span> {req.reason}</p>
              <p>
                <span>Status:</span>
                <span className={`status-badge ${req.status}`} style={{
                  color: req.status === 'approved' ? '#2ecc71' : req.status === 'declined' ? '#ff4757' : '#f39c12',
                  fontWeight: 'bold',
                  marginLeft: '10px',
                  textTransform: 'uppercase'
                }}>
                  {req.status}
                </span>
              </p>
              {req.status === 'pending' && (
                <div className="card-actions" style={{ marginTop: '15px' }}>
                  <button onClick={() => handleUpdateStatus(req._id, 'approved')} style={{ background: '#2ecc71', color: 'white', padding: '8px 15px', borderRadius: '5px', border: 'none', cursor: 'pointer', marginRight: '10px' }}>
                    Approve
                  </button>
                  <button onClick={() => handleUpdateStatus(req._id, 'declined')} style={{ background: '#ff4757', color: 'white', padding: '8px 15px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'staff',
    specialization: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/staff', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStaff(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `http://localhost:5000/api/admin/staff/${editingId}`
        : 'http://localhost:5000/api/admin/staff';

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage(editingId ? 'Staff member updated successfully!' : 'Staff member created successfully!');
        resetForm();
        fetchStaff();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await response.json();
        setMessage(data.message || 'Action failed');
      }
    } catch (error) {
      console.error('Error in staff operation:', error);
      setMessage('An error occurred');
    }
  };

  const handleEdit = (member: any) => {
    setEditingId(member._id);
    setFormData({
      name: member.name,
      email: member.email,
      password: '', // Don't pre-fill password
      phone: member.phone || '',
      role: member.role,
      specialization: member.specialization || '',
      status: member.status || 'active'
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/staff/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        setMessage('Staff member deleted successfully!');
        fetchStaff();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', phone: '', role: 'staff', specialization: '', status: 'active' });
    setShowForm(false);
    setEditingId(null);
  };

  if (loading) return <div className="section-loading">Loading staff...</div>;

  return (
    <div className="staff-section">
      <div className="section-header">
        <h2>Staff Management</h2>
        <button className="add-btn" onClick={() => showForm ? resetForm() : setShowForm(true)}>
          {showForm ? 'Cancel' : 'Add Staff Member'}
        </button>
      </div>

      {message && <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>{message}</div>}

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Staff Member' : 'Add New Staff Member'}</h3>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            {!editingId && (
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            )}
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
            >
              <option value="staff">Staff</option>
              <option value="trainer">Trainer</option>
              <option value="accountant">Accountant</option>
            </select>
            <input
              type="text"
              placeholder="Specialization"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            />
            {editingId && (
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            )}
          </div>
          <button type="submit" className="submit-btn">{editingId ? 'Update Staff' : 'Create Staff'}</button>
        </form>
      )}

      <div className="data-list">
        {staff.length === 0 ? (
          <p className="no-data">No staff members yet</p>
        ) : (
          staff.map((member: any) => (
            <div key={member._id} className="data-card">
              <h4>{member.name}</h4>
              <p><span>Email:</span> {member.email}</p>
              <p><span>Role:</span> <span className="role-badge">{member.role}</span></p>
              <p><span>Phone:</span> {member.phone || 'N/A'}</p>
              <p><span>Status:</span> <span className={`status-badge ${member.status}`}>{member.status}</span></p>
              <div className="card-actions">
                <button className="edit-btn" onClick={() => handleEdit(member)}>
                  <svg className="btn-icon" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(member._id)}>
                  <svg className="btn-icon" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function TrainerManagement() {
  const [trainers, setTrainers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialization: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/trainers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTrainers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching trainers:', error);
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `http://localhost:5000/api/admin/trainers/${editingId}`
        : 'http://localhost:5000/api/admin/trainers';

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...formData, role: 'trainer' })
      });

      if (response.ok) {
        setMessage(editingId ? 'Trainer updated successfully!' : 'Trainer created successfully!');
        resetForm();
        fetchTrainers();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await response.json();
        setMessage(data.message || 'Action failed');
      }
    } catch (error) {
      console.error('Error in trainer operation:', error);
      setMessage('An error occurred');
    }
  };

  const handleEdit = (trainer: any) => {
    setEditingId(trainer._id);
    setFormData({
      name: trainer.name,
      email: trainer.email,
      password: '',
      phone: trainer.phone || '',
      specialization: trainer.specialization || '',
      status: trainer.status || 'active'
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this trainer?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/trainers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        setMessage('Trainer deleted successfully!');
        fetchTrainers();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting trainer:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', phone: '', specialization: '', status: 'active' });
    setShowForm(false);
    setEditingId(null);
  };

  if (loading) return <div className="section-loading">Loading trainers...</div>;

  return (
    <div className="trainers-section">
      <div className="section-header">
        <h2>Trainer Management</h2>
        <button className="add-btn" onClick={() => showForm ? resetForm() : setShowForm(true)}>
          {showForm ? 'Cancel' : 'Add Trainer'}
        </button>
      </div>

      {message && <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>{message}</div>}

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Trainer' : 'Add New Trainer'}</h3>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            {!editingId && (
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            )}
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <select
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              required
            >
              <option value="">Select Specialization</option>
              <option value="Bodybuilding">Bodybuilding</option>
              <option value="Cardio">Cardio</option>
              <option value="Yoga">Yoga</option>
              <option value="CrossFit">CrossFit</option>
              <option value="Strength">Strength Training</option>
            </select>
            {editingId && (
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            )}
          </div>
          <button type="submit" className="submit-btn">{editingId ? 'Update Trainer' : 'Create Trainer'}</button>
        </form>
      )}

      <div className="data-list">
        {trainers.length === 0 ? (
          <p className="no-data">No trainers yet</p>
        ) : (
          trainers.map((trainer: any) => (
            <div key={trainer._id} className="data-card">
              <h4>{trainer.name}</h4>
              <p><span>Email:</span> {trainer.email}</p>
              <p><span>Specialization:</span> <span className="spec-badge">{trainer.specialization}</span></p>
              <p><span>Phone:</span> {trainer.phone || 'N/A'}</p>
              <p><span>Status:</span> <span className={`status-badge ${trainer.status}`}>{trainer.status}</span></p>
              <div className="card-actions">
                <button className="edit-btn" onClick={() => handleEdit(trainer)}>
                  <svg className="btn-icon" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(trainer._id)}>
                  <svg className="btn-icon" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function RevenueTracking() {
  const [revenue, setRevenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/revenue', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRevenue(data.data);
      }
    } catch (error) {
      console.error('Error fetching revenue:', error);
      setRevenue({
        total_revenue: 0,
        transaction_count: 0,
        category_totals: {}
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="section-loading">Loading revenue data...</div>;

  return (
    <div className="revenue-section">
      <h2>Revenue Tracking</h2>
      {revenue && (
        <div className="revenue-container">
          <div className="revenue-summary stats-grid">
            <div className="stat-card">
              <h3>Total Revenue</h3>
              <p className="stat-value">${(revenue.total_revenue || 0).toFixed(2)}</p>
            </div>
            <div className="stat-card">
              <h3>Transactions</h3>
              <p className="stat-value">{revenue.transaction_count || 0}</p>
            </div>
          </div>
          <div className="revenue-breakdown data-card">
            <h3>Revenue by Category</h3>
            <div className="category-list">
              {revenue.category_totals && Object.keys(revenue.category_totals).length > 0 ? (
                Object.entries(revenue.category_totals).map(([category, amount]: [string, any]) => (
                  <div key={category} className="category-row">
                    <span className="cat-name">{category}</span>
                    <span className="cat-amount">${amount.toFixed(2)}</span>
                  </div>
                ))
              ) : (
                <p className="no-data">No revenue data available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MembersManagement() {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/members', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMembers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `http://localhost:5000/api/admin/members/${editingId}`
        : 'http://localhost:5000/api/admin/members';

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage(editingId ? 'Member updated successfully!' : 'Member created successfully!');
        resetForm();
        fetchMembers();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await response.json();
        setMessage(data.message || 'Action failed');
      }
    } catch (error) {
      console.error('Error in member operation:', error);
      setMessage('An error occurred');
    }
  };

  const handleEdit = (member: any) => {
    setEditingId(member._id);
    setFormData({
      name: member.name,
      email: member.email,
      password: '',
      phone: member.phone || '',
      status: member.status || 'active'
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/members/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        setMessage('Member deleted successfully!');
        fetchMembers();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', password: '', phone: '', status: 'active' });
    setShowForm(false);
    setEditingId(null);
  };

  if (loading) return <div className="section-loading">Loading members...</div>;

  return (
    <div className="members-section">
      <div className="section-header">
        <h2>Members Management</h2>
        <button className="add-btn" onClick={() => showForm ? resetForm() : setShowForm(true)}>
          {showForm ? 'Cancel' : 'Add Member'}
        </button>
      </div>

      {message && <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>{message}</div>}

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Member' : 'Add New Member'}</h3>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            {!editingId && (
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            )}
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            {editingId && (
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            )}
          </div>
          <button type="submit" className="submit-btn">{editingId ? 'Update Member' : 'Create Member'}</button>
        </form>
      )}

      <div className="data-list">
        {members.length === 0 ? (
          <p className="no-data">No members yet</p>
        ) : (
          members.map((member: any) => (
            <div key={member._id} className="data-card">
              <h4>{member.name}</h4>
              <p><span>Email:</span> {member.email}</p>
              <p><span>Phone:</span> {member.phone || 'N/A'}</p>
              <p><span>Status:</span> <span className={`status-badge ${member.status}`}>{member.status}</span></p>
              <p><span>Joined:</span> {new Date(member.createdAt).toLocaleDateString()}</p>
              <div className="card-actions">
                <button className="edit-btn" onClick={() => handleEdit(member)}>
                  <svg className="btn-icon" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(member._id)}>
                  <svg className="btn-icon" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Settings() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to change password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>Account Settings</h2>
      </div>

      <div className="settings-grid" style={{ maxWidth: '600px', marginTop: '20px' }}>
        <div className="settings-card" style={{ background: 'var(--surface-dark)', padding: '30px', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
          <h3>Change Password</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.9rem' }}>
            Ensure your account is using a long, random password to stay secure.
          </p>

          {message.text && (
            <div className={`message ${message.type}`} style={{
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '20px',
              backgroundColor: message.type === 'success' ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
              color: message.type === 'success' ? '#2ecc71' : '#e74c3c',
              border: `1px solid ${message.type === 'success' ? '#2ecc71' : '#e74c3c'}`
            }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="settings-form">
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>Current Password</label>
              <input
                type="password"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>New Password</label>
              <input
                type="password"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
              />
            </div>
            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: 'var(--text-primary)' }}>Confirm New Password</label>
              <input
                type="password"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white' }}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
              style={{ padding: '12px 25px', width: 'auto' }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function OrderManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setMessage('Order status updated!');
        fetchOrders();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) return <div className="section-loading">Loading orders...</div>;

  return (
    <div className="orders-management">
      <div className="section-header">
        <h2>Order Management</h2>
      </div>

      {message && <div className="success-message" style={{ marginBottom: '20px', color: 'var(--accent-teal)' }}>{message}</div>}

      <div className="data-list">
        {orders.length === 0 ? (
          <p className="no-data">No orders to display.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="data-card order-admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <span className="order-id">#{order._id.slice(-6).toUpperCase()}</span>
                <span className={`status-badge ${order.status}`}>{order.status.toUpperCase()}</span>
              </div>

              <p><span>Member:</span> {order.member_id?.name || 'Unknown'}</p>
              <p><span>Total:</span> <span className="cat-amount">${order.total_amount.toFixed(2)}</span></p>
              <p><span>Method:</span> {order.payment_method}</p>
              <p><span>Address:</span> {order.shipping_address}</p>

              <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid var(--glass-border)' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Update Status</label>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  style={{ background: 'var(--bg-dark)', color: 'white', padding: '8px', borderRadius: '8px', border: '1px solid var(--glass-border)', width: '100%' }}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
