"use client";

import React, { useState } from 'react';

const UserSalaryPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [salaryLocalCurrency, setSalaryLocalCurrency] = useState('');
  const [salaryEuros, setSalaryEuros] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/salary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          salary_local_currency: parseFloat(salaryLocalCurrency),
          salary_euros: parseFloat(salaryEuros),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        // Clear form after successful submission
        setName('');
        setEmail('');
        setSalaryLocalCurrency('');
        setSalaryEuros('');
      } else {
        setError(data.message || 'Failed to submit salary details');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/20">
          <h1 className="text-4xl font-bold text-center text-white mb-8 tracking-tight">
            Salary Submission
          </h1>

          {message && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6 text-green-200">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="salaryLocalCurrency" className="block text-sm font-medium text-white/80 mb-2">
                  Local Currency Salary (KSH)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="salaryLocalCurrency"
                    value={salaryLocalCurrency}
                    onChange={(e) => setSalaryLocalCurrency(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
                    placeholder="0.00"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-white/50">KSH</span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="salaryEuros" className="block text-sm font-medium text-white/80 mb-2">
                  Euro Salary (€)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="salaryEuros"
                    value={salaryEuros}
                    onChange={(e) => setSalaryEuros(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
                    placeholder="0.00"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-white/50">€</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Salary Details'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-white/60 text-sm">
            <p>Your salary information will be reviewed by the administrator.</p>
            <p className="mt-2">Commission will be calculated and added to your displayed salary.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSalaryPage; 