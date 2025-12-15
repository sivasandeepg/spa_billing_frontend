import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom'; 
import { useAuth } from '../contexts/AuthContext';
import { User, Lock, Eye, EyeOff, Sparkles, Waves, Leaf, Droplets, ChevronDown } from 'lucide-react';
import logo from '../assets/logo2.png';   

const Login = () => {
  const { user, login } = useAuth();
  const location = useLocation();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  const from = location.state?.from?.pathname || '/';

  if (user) {
    const redirectPath = user.role === 'admin' ? '/admin' :
      user.role === 'manager' ? '/manager' : '/pos';
    return <Navigate to={from === '/' ? redirectPath : from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(credentials);

    if (result.success) {
      const redirectPath = result.user.role === 'admin' ? '/admin' :
        result.user.role === 'manager' ? '/manager' : '/pos';
      window.location.href = from === '/' ? redirectPath : from;
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const demoCredentials = [
    { username: 'admin', password: 'admin123', role: 'Admin', color: 'bg-teal-500' },
    { username: 'manager1', password: 'manager123', role: 'Manager', color: 'bg-cyan-500' },
    { username: 'pos1', password: 'pos123', role: 'Staff', color: 'bg-teal-400' }
  ];

  // Enhanced Logo Component with subtle animations
  const LuxeAuraLogo = ({ size = "w-18 h-18" }) => (
    <div className={`relative ${size} mx-auto group`}>
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-700"></div>
      <img 
       src={logo}  
        alt="LUXE AURA Logo"
        className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-105"
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
      <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-amber-400 animate-pulse opacity-70" />
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-60" style={{animationDelay: '1s'}}></div>
    </div>
  ); 
  
  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 to-teal-50/30">
      {/* Mobile Layout (default) */}
      <div className="lg:hidden h-screen flex flex-col">
        {/* Mobile Header Section - Enhanced */}
        <div className="flex-1 bg-gradient-to-br from-[#2d5a5a] via-[#366b6b] to-[#2d5a5a] relative overflow-hidden px-6 py-8 flex flex-col justify-center items-center">
          {/* Enhanced Background Elements */}
          <div className="absolute top-4 left-4 w-20 h-20 bg-gradient-to-r from-amber-300/10 to-yellow-300/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-8 right-6 w-16 h-16 bg-gradient-to-r from-yellow-300/15 to-amber-400/15 rounded-full blur-lg" 
               style={{
                 animation: 'float 4s ease-in-out infinite',
                 animationDelay: '1s'
               }}></div>
          <div className="absolute top-1/3 right-4 w-12 h-12 bg-gradient-to-r from-amber-300/10 to-yellow-300/10 rounded-full blur-lg animate-ping" 
               style={{animationDelay: '2s', animationDuration: '3s'}}></div>
          
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-amber-300/30 rounded-full animate-pulse"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + i * 10}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '2s'
                }}
              ></div>
            ))}
          </div>

          <div className="text-center z-10">
            <LuxeAuraLogo size="w-24 h-24" />
            <h1 className="text-4xl font-extralight mb-2 mt-4 tracking-wide">
              <span className="text-white drop-shadow-lg">
                LUXE AURA
              </span>
            </h1>
            <p className="text-white/90 text-lg font-light mb-1 tracking-wide">Luxury Wellness</p>
            <p className="text-white/80 text-sm tracking-wider">Where tranquility meets technology</p>
          </div>
        </div>

        {/* Mobile Form Section - Enhanced */}
        <div className="flex-1 bg-white/95 backdrop-blur-sm px-6 py-6 flex items-center justify-center overflow-y-auto">
          <div className="w-full max-w-sm">
            {/* Form Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-500/90 to-cyan-600/90 rounded-xl mb-4 shadow-lg backdrop-blur-sm group hover:scale-105 transition-all duration-300">
                <img 
                 src={logo}
                  alt="LUXE AURA"
                  className="w-6 h-6 brightness-0 invert transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h2 className="text-xl font-medium text-slate-800 mb-1 tracking-wide">Welcome</h2>  
              <p className="text-slate-600/80 text-sm">Sign in to your account</p>
            </div>

            {/* Login Form - Enhanced */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="group">
                <label className="text-xs font-medium text-slate-700/80 block mb-2 tracking-wide">USERNAME</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-teal-500" />
                  <input
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-lg focus:border-teal-400/60 focus:ring-1 focus:ring-teal-400/30 focus:bg-white transition-all duration-300 text-slate-800 text-sm backdrop-blur-sm"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="text-xs font-medium text-slate-700/80 block mb-2 tracking-wide">PASSWORD</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-teal-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-2.5 bg-slate-50/80 border border-slate-200/50 rounded-lg focus:border-teal-400/60 focus:ring-1 focus:ring-teal-400/30 focus:bg-white transition-all duration-300 text-slate-800 text-sm backdrop-blur-sm"
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50/80 border border-red-200/50 text-red-700 px-3 py-2 rounded-lg text-xs backdrop-blur-sm animate-fadeIn">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-500/90 to-cyan-500/90 hover:from-teal-600 hover:to-cyan-600 text-white py-2.5 rounded-lg font-medium text-sm shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 transform hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            {/* Demo Accounts - Enhanced */}
            <div className="mt-5">
              <button
                type="button"
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                className="w-full flex items-center justify-center space-x-2 py-2 text-slate-600/80 border-t border-slate-100 hover:text-slate-700 transition-colors duration-200"
              >
                <span className="text-xs font-medium tracking-wide">Demo Accounts</span>
                <div className={`transform transition-transform duration-300 ${showDemoAccounts ? 'rotate-180' : ''}`}>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </button>

              <div className={`overflow-hidden transition-all duration-500 ease-out ${
                showDemoAccounts ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
              }`}>
                <div className="space-y-2">
                  {demoCredentials.map((cred, index) => (
                    <div key={index} 
                         className="bg-slate-50/50 backdrop-blur-sm p-3 rounded-lg hover:bg-slate-100/50 transition-all duration-200 transform hover:scale-[1.02]"
                         style={{
                           animationDelay: `${index * 100}ms`,
                           animation: showDemoAccounts ? 'slideInUp 0.4s ease-out forwards' : ''
                         }}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${cred.color} shadow-sm`}></div>
                          <span className="font-medium text-slate-700 text-xs">{cred.role}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCredentials({ username: cred.username, password: cred.password })}
                          className="px-3 py-1 bg-teal-500/90 hover:bg-teal-600 text-white text-xs rounded-md font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm"
                        >
                          Use
                        </button>
                      </div>
                      <div className="text-xs text-slate-500/70 mt-1 font-mono">{cred.username}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout (lg and up) - Enhanced */}
      <div className="hidden lg:flex h-screen">
        {/* Left Side - Enhanced Desktop Spa Theme (50% width) */}
        <div className="w-1/2 relative bg-gradient-to-br from-[#2d5a5a] via-[#366b6b] to-[#2d5a5a] overflow-hidden">
          {/* Enhanced Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-amber-300/10 to-yellow-300/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-yellow-300/15 to-amber-400/15 rounded-full blur-lg" 
                 style={{
                   animation: 'float 6s ease-in-out infinite',
                   animationDelay: '1s'
                 }}></div>
            <div className="absolute bottom-32 left-16 w-40 h-40 bg-gradient-to-r from-amber-300/8 to-yellow-300/8 rounded-full blur-2xl animate-pulse" 
                 style={{animationDelay: '2s', animationDuration: '4s'}}></div>
            <div className="absolute top-0 right-0 w-96 h-96 opacity-5">
              <div className="w-full h-full border-2 border-amber-400/20 rounded-full" 
                   style={{
                     animation: 'spin 30s linear infinite'
                   }}></div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-amber-300/20 rounded-full animate-pulse"
                  style={{
                    left: `${15 + i * 10}%`,
                    top: `${20 + i * 8}%`,
                    animationDelay: `${i * 0.7}s`,
                    animationDuration: '3s'
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Desktop Content - Enhanced */}
          <div className="relative z-10 flex flex-col justify-center items-center h-full p-8 text-white">
            <div className="text-center mb-12">
              <LuxeAuraLogo size="w-28 h-28" />
              <h1 className="text-5xl xl:text-6xl font-extralight mb-4 mt-6 tracking-wide">
                <span className="text-white drop-shadow-lg">
                  LUXE AURA
                </span>
              </h1>
              <p className="text-white/90 text-base xl:text-lg tracking-wider font-light">Luxury Wellness Experience</p>
            </div>

            {/* Enhanced Features */}
            <div className="space-y-6 max-w-lg mb-12">
              {[
                { icon: Waves, title: "Seamless Management", desc: "Effortless spa operations", color: "from-amber-200/20 to-yellow-300/20" },
                { icon: Leaf, title: "Natural Flow", desc: "Intuitive user experience", color: "from-yellow-200/20 to-amber-300/20" },
                { icon: Droplets, title: "Pure Analytics", desc: "Crystal clear insights", color: "from-amber-300/20 to-yellow-400/20" }
              ].map((feature, index) => (
                <div key={index} 
                     className="flex items-center space-x-4 group hover:transform hover:translate-x-2 transition-all duration-300"
                     style={{
                       animationDelay: `${index * 200}ms`,
                       opacity: 0,
                       animation: 'slideInLeft 0.8s ease-out forwards'
                     }}>
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 backdrop-blur-sm border border-amber-300/20`}>
                    <feature.icon className="w-6 h-6 text-amber-200 group-hover:scale-110 transition-transform duration-200" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-base group-hover:text-amber-100 transition-colors duration-200">{feature.title}</h3>
                    <p className="text-white/80 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center max-w-lg">
              <p className="text-white/90 italic text-base xl:text-lg leading-relaxed font-light tracking-wide">
                "Wellness is not a destination, it's a way of life. Let technology enhance your journey to serenity."
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Enhanced Desktop Form (50% width) */}
        <div className="w-1/2 flex items-center justify-center bg-white/95 backdrop-blur-sm relative overflow-y-auto">
          <div className="absolute top-20 right-20 w-32 h-32 bg-amber-100/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-32 left-20 w-24 h-24 bg-yellow-100/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
          
          <div className="w-full max-w-md px-8 py-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 xl:p-10 shadow-xl border border-slate-200/30 hover:shadow-2xl transition-all duration-500">
              {/* Desktop Form Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-teal-500/90 to-cyan-600/90 rounded-xl mb-6 shadow-lg backdrop-blur-sm group hover:scale-105 transition-all duration-300">
                  <img 
                    src={logo}        
                    alt="LUXE AURA"
                    className="w-7 h-7 brightness-0 invert transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <h2 className="text-2xl font-medium text-slate-800 mb-2 tracking-wide">Welcome</h2>
                <p className="text-slate-600/80 text-base">Sign in to your account</p>
              </div>

              {/* Enhanced Desktop Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="group">
                  <label className="text-sm font-medium text-slate-700/80 block mb-3 tracking-wide">USERNAME</label>
                  <div className="relative">
                    <User className="absolute left-4 top-4 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-teal-500" />
                    <input
                      type="text"
                      value={credentials.username}
                      onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50/50 border border-slate-200/50 rounded-xl focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20 focus:bg-white/80 transition-all duration-300 text-slate-800 backdrop-blur-sm hover:bg-slate-50/70"
                      placeholder="Enter username"
                      required
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="text-sm font-medium text-slate-700/80 block mb-3 tracking-wide">PASSWORD</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-teal-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                      className="w-full pl-12 pr-14 py-3.5 bg-slate-50/50 border border-slate-200/50 rounded-xl focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/20 focus:bg-white/80 transition-all duration-300 text-slate-800 backdrop-blur-sm hover:bg-slate-50/70"
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50/80 border border-red-200/50 text-red-700 px-4 py-3 rounded-xl backdrop-blur-sm animate-fadeIn">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-500/90 to-cyan-500/90 hover:from-teal-600 hover:to-cyan-600 text-white py-3.5 rounded-xl font-medium text-base shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 transform hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm"
                >
                  {loading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </span>
                  ) : 'Sign In'}
                </button>
              </form>

              {/* Enhanced Desktop Demo Accounts */}
              <div className="mt-8">
                <button
                  type="button"
                  onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                  className="w-full flex items-center justify-center space-x-2 py-3 text-slate-600/80 border-t border-slate-100/50 hover:text-slate-700 transition-colors duration-200"
                >
                  <span className="text-sm font-medium tracking-wide">Demo Accounts</span>
                  <div className={`transform transition-transform duration-300 ${showDemoAccounts ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <div className={`overflow-hidden transition-all duration-500 ease-out ${
                  showDemoAccounts ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                }`}>
                  <div className="space-y-3">
                    {demoCredentials.map((cred, index) => (
                      <div key={index} 
                           className="bg-slate-50/50 backdrop-blur-sm p-4 rounded-xl hover:bg-slate-100/50 transition-all duration-200 transform hover:scale-[1.02]"
                           style={{
                             animationDelay: `${index * 100}ms`,
                             animation: showDemoAccounts ? 'slideInUp 0.4s ease-out forwards' : ''
                           }}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${cred.color} shadow-sm`}></div>
                            <span className="font-medium text-slate-700">{cred.role}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCredentials({ username: cred.username, password: cred.password })}
                            className="px-4 py-1.5 bg-teal-500/90 hover:bg-teal-600 text-white text-sm rounded-lg font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm"
                          >
                            Use
                          </button>
                        </div>
                        <div className="text-xs text-slate-500/70 mt-1 font-mono pl-6">{cred.username}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Login;  