import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_members: 0,
    total_revenue: 0,
    active_staff: 0,
    monthly_growth: 12.5
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

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
          </div>
        )}

        {activeTab === 'staff' && <StaffManagement />}
        {activeTab === 'trainers' && <TrainerManagement />}
        {activeTab === 'revenue' && <RevenueTracking />}
        {activeTab === 'members' && <MembersManagement />}
      </div>
    </div>
  );
}

function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'staff',
    specialization: ''
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
      const response = await fetch('http://localhost:5000/api/admin/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setMessage('Staff member created successfully!');
        setFormData({ name: '', email: '', password: '', phone: '', role: 'staff', specialization: '' });
        setShowForm(false);
        fetchStaff();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await response.json();
        setMessage(data.message || 'Failed to create staff member');
      }
    } catch (error) {
      console.error('Error creating staff:', error);
      setMessage('Error creating staff member');
    }
  };

  if (loading) return <div className="section-loading">Loading staff...</div>;

  return (
    <div className="staff-section">
      <div className="section-header">
        <h2>Staff Management</h2>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Staff Member'}
        </button>
      </div>

      {message && <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>{message}</div>}

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
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
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
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
              placeholder="Specialization (e.g., Bodybuilding)"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            />
          </div>
          <button type="submit" className="submit-btn">Create Staff</button>
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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialization: ''
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
      const response = await fetch('http://localhost:5000/api/admin/trainers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...formData, role: 'trainer' })
      });
      if (response.ok) {
        setMessage('Trainer created successfully!');
        setFormData({ name: '', email: '', password: '', phone: '', specialization: '' });
        setShowForm(false);
        fetchTrainers();
        setTimeout(() => setMessage(''), 3000);
      } else {
        const data = await response.json();
        setMessage(data.message || 'Failed to create trainer');
      }
    } catch (error) {
      console.error('Error creating trainer:', error);
      setMessage('Error creating trainer');
    }
  };

  if (loading) return <div className="section-loading">Loading trainers...</div>;

  return (
    <div className="trainers-section">
      <div className="section-header">
        <h2>Trainer Management</h2>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Trainer'}
        </button>
      </div>

      {message && <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>{message}</div>}

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
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
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
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
          </div>
          <button type="submit" className="submit-btn">Create Trainer</button>
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
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="section-loading">Loading members...</div>;

  return (
    <div className="members-section">
      <h2>Members Management</h2>
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
