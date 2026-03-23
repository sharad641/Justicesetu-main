import { useState, useEffect, useMemo } from 'react';
import { Users, Search, Shield, UserCheck, Mail, Calendar, Filter } from 'lucide-react';
import api from '../api';
import './DashboardStyles.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.getAllUsers();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const roleColors = {
    citizen: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', label: 'Citizen' },
    lawyer: { bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6', label: 'Lawyer' },
    admin: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', label: 'Admin' },
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 4px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <Users size={24} style={{ color: '#6366f1' }} /> User Management
          </h2>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>{filteredUsers.length} users found</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(15,23,42,0.6)', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Search size={20} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.95rem', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'citizen', 'lawyer', 'admin'].map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              style={{
                padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                fontWeight: '600', fontSize: '0.85rem', transition: 'all 0.2s',
                background: roleFilter === role ? 'rgba(99,102,241,0.2)' : 'rgba(15,23,42,0.6)',
                color: roleFilter === role ? '#a5b4fc' : 'var(--text-muted)',
                boxShadow: roleFilter === role ? 'inset 0 0 0 1px rgba(99,102,241,0.4)' : 'inset 0 0 0 1px rgba(255,255,255,0.06)',
                textTransform: 'capitalize'
              }}
            >
              {role === 'all' ? 'All Roles' : role}
            </button>
          ))}
        </div>
      </div>

      {/* User Table */}
      <div style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Users size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p>No users match your criteria.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr>
                  {['User', 'Email', 'Role', 'Verified', 'Joined'].map(h => (
                    <th key={h} style={{ padding: '16px 24px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(11,15,25,0.5)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => {
                  const roleStyle = roleColors[u.role] || roleColors.citizen;
                  return (
                    <tr key={u.id} style={{ transition: 'background 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: roleStyle.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: roleStyle.color, fontWeight: '700', flexShrink: 0 }}>
                          {u.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{u.name}</span>
                      </td>
                      <td style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{u.email}</td>
                      <td style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ background: roleStyle.bg, color: roleStyle.color, padding: '4px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', textTransform: 'capitalize' }}>{u.role}</span>
                      </td>
                      <td style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        {u.isVerified ? (
                          <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}><UserCheck size={16} /> Verified</span>
                        ) : (
                          <span style={{ color: '#f59e0b', fontSize: '0.85rem' }}>Pending</span>
                        )}
                      </td>
                      <td style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
