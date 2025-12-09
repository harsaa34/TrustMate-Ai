import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../hooks/useAuth'; // Change this import

const Sessions = () => {
  const navigate = useNavigate();
  const logoutMutation = useLogout(); // Use existing logout hook
  
  const [sessions, setSessions] = useState([
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'New York, USA',
      lastActive: '2 minutes ago',
      current: true,
      ip: '192.168.1.1',
    },
    {
      id: 2,
      device: 'Safari on iPhone',
      location: 'San Francisco, USA',
      lastActive: '5 hours ago',
      current: false,
      ip: '192.168.1.2',
    },
    {
      id: 3,
      device: 'Firefox on Mac',
      location: 'London, UK',
      lastActive: '2 days ago',
      current: false,
      ip: '192.168.1.3',
    },
  ]);

  const handleLogoutSession = (id: number) => {
    setSessions(sessions.filter(session => session.id !== id));
  };

  const handleLogoutAllSessions = () => {
    if (window.confirm('Are you sure you want to logout from all other devices?')) {
      // Call your backend API to logout from all devices
      // For now, just remove all non-current sessions
      setSessions(sessions.filter(session => session.current));
      alert('Logged out from all other devices');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Active Sessions</h2>
              <p className="text-gray-600">Manage your account sessions across devices</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              ← Back
            </button>
          </div>

          {/* Current Session */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Current Session</h3>
            {sessions.filter(s => s.current).map((session) => (
              <div key={session.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{session.device}</h4>
                      <p className="text-sm text-gray-600">
                        {session.location} • {session.lastActive}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                    Active Now
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Other Sessions */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Other Active Sessions</h3>
              <button
                onClick={handleLogoutAllSessions}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
              >
                Logout All Others
              </button>
            </div>
            
            {sessions.filter(s => !s.current).length > 0 ? (
              <div className="space-y-3">
                {sessions.filter(s => !s.current).map((session) => (
                  <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{session.device}</h4>
                          <p className="text-sm text-gray-600">
                            {session.location} • Last active: {session.lastActive}
                          </p>
                          <p className="text-xs text-gray-500">IP: {session.ip}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleLogoutSession(session.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600">No other active sessions</p>
                <p className="text-sm text-gray-500 mt-1">You're only logged in on this device</p>
              </div>
            )}
          </div>

          {/* Security Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Security Tips</h4>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Regularly review your active sessions</li>
              <li>Logout from devices you no longer use</li>
              <li>Use strong, unique passwords</li>
              <li>Enable two-factor authentication if available</li>
            </ul>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {sessions.length} active session{sessions.length !== 1 ? 's' : ''}
              </p>
              <button
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm font-medium flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>{logoutMutation.isPending ? 'Logging out...' : 'Logout from All'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sessions;