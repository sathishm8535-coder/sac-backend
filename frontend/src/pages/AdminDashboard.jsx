import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
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

  if (!analytics) return <div className="flex"><Sidebar /><div className="flex-1 p-8">Loading...</div></div>;

  const cards = [
    { icon: Users, label: 'Total Students', value: analytics.totalStudents, color: 'bg-blue-500' },
    { icon: ClipboardList, label: 'Total Exams', value: analytics.totalExams, color: 'bg-green-500' },
    { icon: FileQuestion, label: 'Total Results', value: analytics.totalResults, color: 'bg-purple-500' },
    { icon: TrendingUp, label: 'Pass Percentage', value: `${analytics.passPercentage}%`, color: 'bg-orange-500' }
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Subject Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.subjectPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgScore" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
