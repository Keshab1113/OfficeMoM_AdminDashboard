import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, Building2, Users, CreditCard, HelpCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();

  const features = [
    { icon: Users, title: 'User Management', description: 'Manage all user accounts and permissions' },
    { icon: CreditCard, title: 'Pricing Plans', description: 'Configure subscription plans and pricing' },
    { icon: HelpCircle, title: 'FAQ System', description: 'Manage help content and support materials' },
    { icon: Building2, title: 'Business Insights', description: 'Monitor key metrics and performance' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Authentication service unavailable. Please try again later.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const FeatureIcon = features[activeFeature].icon;

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">OfficeMoM</h1>
                <p className="text-blue-400 font-medium">Admin Console</p>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-400">
              Sign in to access the administration dashboard
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-center space-x-3 animate-fade-in">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <span className="text-red-200 text-sm font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="block w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="block w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Authenticating...
                  </>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </div>

            
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              © 2024 OfficeMoM. All rights reserved.
              <br />
              Secure administrative access only.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Feature Showcase */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-gray-800 to-gray-900 border-l border-gray-700">
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="max-w-md">
            {/* Feature Display */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl mx-auto mb-6 transform hover:scale-105 transition-transform duration-300">
                <FeatureIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {features[activeFeature].title}
              </h3>
              <p className="text-gray-400 text-lg">
                {features[activeFeature].description}
              </p>
            </div>

            {/* Feature Indicators */}
            <div className="flex justify-center space-x-2 mb-12">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeFeature 
                      ? 'bg-blue-500 w-8' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-2xl font-bold text-blue-400 mb-1">99.9%</div>
                <div className="text-xs text-gray-400">Uptime</div>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-2xl font-bold text-green-400 mb-1">256-bit</div>
                <div className="text-xs text-gray-400">Encryption</div>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-2xl font-bold text-purple-400 mb-1">24/7</div>
                <div className="text-xs text-gray-400">Monitoring</div>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-2xl font-bold text-yellow-400 mb-1">SOC 2</div>
                <div className="text-xs text-gray-400">Compliant</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Feature Toggle */}
      <div className="lg:hidden fixed bottom-6 right-6">
        <button
          onClick={() => setActiveFeature((prev) => (prev + 1) % features.length)}
          className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
        >
          <FeatureIcon className="h-6 w-6 text-white" />
        </button>
      </div>
    </div>
  );
}