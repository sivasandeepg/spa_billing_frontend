import React, { useMemo, useState, useEffect } from 'react';
import { 
  Sparkles, 
  Users, 
  Calendar, 
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  MapPin,
  Heart,
  Leaf,
  Waves
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';

const SpaDashboard = () => {
  const [animatedValues, setAnimatedValues] = useState({
    bookings: 0,
    revenue: 0,
    rating: 0,
    customers: 0
  });

  // Animation effect for counter
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues({
        bookings: 47,
        revenue: 3240,
        rating: 4.8,
        customers: 156
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Sample trend data for mini charts
  const bookingsTrend = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      value: 40 + Math.sin(i * 0.5) * 8 + Math.random() * 5
    }));
  }, []);

  const revenueTrend = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      value: 3000 + Math.sin(i * 0.4) * 300 + Math.random() * 200
    }));
  }, []);

  const ratingTrend = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      value: 4.5 + Math.sin(i * 0.3) * 0.3 + Math.random() * 0.2
    }));
  }, []);

  const customersTrend = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => ({
      value: 150 + Math.sin(i * 0.6) * 20 + Math.random() * 15
    }));
  }, []);

  // Chart data - services performance
  const servicesData = useMemo(() => [
    { name: 'Deep Tissue', bookings: 45, revenue: 4500 },
    { name: 'Aromatherapy', bookings: 38, revenue: 3800 },
    { name: 'Hot Stone', bookings: 32, revenue: 4200 },
    { name: 'Reflexology', bookings: 28, revenue: 2800 },
    { name: 'Facial', bookings: 35, revenue: 3500 },
    { name: 'Body Wrap', bookings: 22, revenue: 3300 }
  ], []);

  // Weekly performance data
  const weeklyData = useMemo(() => {
    const last7Days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return last7Days.map((day) => ({
      day,
      bookings: Math.floor(Math.random() * 25) + 30,
      revenue: Math.floor(Math.random() * 1500) + 2800
    }));
  }, []);

  const MetricCard = ({ icon: Icon, title, value, unit, status, bgColor, iconBg, trendData, strokeColor }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 transform cursor-pointer group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl ${iconBg} group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-bold text-gray-900">
            {typeof value === 'string' ? value : value.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500 font-medium">{unit}</span>
        </div>
        <div className="mt-2">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${bgColor} text-gray-700`}>
            {status}
          </span>
        </div>
      </div>

      {/* Mini trend chart */}
      <div className="h-16 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id={`gradient-${title.replace(/\s/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.2}/>
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={strokeColor}
              strokeWidth={2}
              fill={`url(#gradient-${title.replace(/\s/g, '')})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const StatCard = ({ icon: Icon, title, value, subtitle, iconBg }) => (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all duration-300 transform cursor-pointer group">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-xl ${iconBg} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const AppointmentCard = ({ time, service, client, room, duration }) => (
    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-blue-50 hover:shadow-md hover:-translate-x-2 transition-all duration-300 transform cursor-pointer group">
      <div className="flex items-center space-x-4">
        <div className="bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-lg group-hover:bg-blue-600 transition-colors duration-300">
          {time}
        </div>
        <div>
          <p className="font-medium text-gray-900">{service}</p>
          <p className="text-sm text-gray-500">{client}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">{room}</p>
        <p className="text-sm text-gray-500">{duration}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ✨ DEMO SPA Centers
          </h1>
          <p className="text-gray-600">August 12, 2021 • Wellness Dashboard</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            icon={Calendar}
            title="Daily Bookings"
            value={animatedValues.bookings}
            unit="today"
            status="Normal"
            bgColor="bg-orange-100"
            iconBg="bg-orange-500"
            trendData={bookingsTrend}
            strokeColor="#f97316"
          />
          <MetricCard
            icon={Heart}
            title="Active Clients"
            value={animatedValues.customers}
            unit="active"
            status="Normal"
            bgColor="bg-red-100"
            iconBg="bg-red-500"
            trendData={customersTrend}
            strokeColor="#ef4444"
          />
          <MetricCard
            icon={DollarSign}
            title="Revenue"
            value={`$${animatedValues.revenue}`}
            unit="today"
            status="Normal"
            bgColor="bg-teal-100"
            iconBg="bg-teal-500"
            trendData={revenueTrend}
            strokeColor="#14b8a6"
          />
          <MetricCard
            icon={Star}
            title="Rating"
            value={animatedValues.rating}
            unit="/ 5.0"
            status="Excellent"
            bgColor="bg-purple-100"
            iconBg="bg-purple-500"
            trendData={ratingTrend}
            strokeColor="#8b5cf6"
          />
        </div>

        {/* Spa Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Therapists"
            value="24"
            subtitle="Available today"
            iconBg="bg-indigo-500"
          />
          <StatCard
            icon={Sparkles}
            title="Sessions"
            value="18"
            subtitle="In progress"
            iconBg="bg-pink-500"
          />
          <StatCard
            icon={Clock}
            title="Completed"
            value="32"
            subtitle="Today"
            iconBg="bg-green-500"
          />
          <StatCard
            icon={MapPin}
            title="Locations"
            value="8"
            subtitle="Active centers"
            iconBg="bg-yellow-500"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Services Performance */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform">
            <div className="flex items-center space-x-3 mb-6">
              <Leaf className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Popular Services</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={servicesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="bookings" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Performance */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Weekly Performance</h3>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  name="Revenue ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-2xl shadow-sm mb-8 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <AppointmentCard
                time="10:30 AM"
                service="Deep Tissue Massage"
                client="Sarah Johnson"
                room="Room 3"
                duration="90 min"
              />
              <AppointmentCard
                time="2:00 PM"
                service="Aromatherapy"
                client="Michael Chen"
                room="Room 1"
                duration="75 min"
              />
              <AppointmentCard
                time="4:30 PM"
                service="Facial Treatment"
                client="Emma Wilson"
                room="Room 2"
                duration="60 min"
              />
            </div>
          </div>
        </div>

        {/* Spa Centers Performance */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Spa Centers</h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bookings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { name: "Downtown Center", bookings: 12, revenue: "$2,840", rating: 4.9, status: "Active" },
                  { name: "Oceanview Branch", bookings: 8, revenue: "$3,260", rating: 4.8, status: "Active" },
                  { name: "Mountain Retreat", bookings: 15, revenue: "$4,150", rating: 4.7, status: "Active" },
                  { name: "Garden Sanctuary", bookings: 10, revenue: "$2,890", rating: 4.9, status: "Active" }
                ].map((location, index) => (
                  <tr key={index} className="hover:bg-blue-50 hover:scale-[1.02] transition-all duration-300 transform">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {location.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {location.bookings} sessions
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {location.revenue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        {location.rating}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        {location.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaDashboard;