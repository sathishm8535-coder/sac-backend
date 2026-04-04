import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';
import { Users, ClipboardList, FileQuestion, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get('/api/results/analytics');
      setAnalytics(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!analytics) return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>;

  const cards = [
    { icon: Users, label: 'Total Students', value: analytics.totalStudents, color: 'bg-blue-500' },
    { icon: ClipboardList, label: 'Total Exams', value: analytics.totalExams, color: 'bg-green-500' },
    { icon: FileQuestion, label: 'Total Results', value: analytics.totalResults, color: 'bg-purple-500' },
    { icon: TrendingUp, label: 'Pass Percentage', value: `${analytics.passPercentage}%`, color: 'bg-orange-500' }
  ];

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {cards.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
                </div>
                <div className={`${color} p-4 rounded-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Subject Performance</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={analytics.subjectPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="avgScore" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
