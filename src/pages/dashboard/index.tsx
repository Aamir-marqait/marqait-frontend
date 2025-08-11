import { useAuthStore } from '../../stores/authStore';
import { LogOut, User, Mail, Calendar } from 'lucide-react';

function Dashboard() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600">Please log in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Welcome back, {user.name}!
              </h1>
              <p className="text-slate-600">Here's what's happening with your account today.</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <User className="h-8 w-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-900">Profile</h3>
              </div>
              <p className="text-slate-600">Manage your account settings and preferences</p>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="h-8 w-8 text-green-600" />
                <h3 className="text-lg font-semibold text-slate-900">Projects</h3>
              </div>
              <p className="text-slate-600">View and manage your active projects</p>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Mail className="h-8 w-8 text-purple-600" />
                <h3 className="text-lg font-semibold text-slate-900">Messages</h3>
              </div>
              <p className="text-slate-600">Check your notifications and messages</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-slate-400" />
                <span className="text-slate-700">Name: {user.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-slate-400" />
                <span className="text-slate-700">Email: {user.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-slate-400" />
                <span className="text-slate-700">Last login: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
