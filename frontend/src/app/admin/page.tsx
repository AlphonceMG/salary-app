"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

interface UserSalary {
  id: number;
  name: string;
  email: string;
  salary_local_currency: number;
  salary_euros: number;
  commission: number;
  displayed_salary: number;
}

const AdminPanelPage: React.FC = () => {
  const [salaries, setSalaries] = useState<UserSalary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [editUserEmail, setEditUserEmail] = useState<string | null>(null);
  const [newCommission, setNewCommission] = useState<string>('');
  const [newLocalSalary, setNewLocalSalary] = useState<string>('');
  const [newEuroSalary, setNewEuroSalary] = useState<string>('');
  const [updateMessage, setUpdateMessage] = useState<string>('');
  const [updateError, setUpdateError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const isAdmin = localStorage.getItem('isAdmin');

    if (!token || isAdmin !== '1') {
      router.push('/login');
    }
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch('http://localhost:8000/api/salaries', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.status === 401) {
        router.push('/login');
        return;
      }

      if (response.status === 403) {
        router.push('/admin-register');
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setSalaries(data.salaries);
      } else {
        setError(data.message || 'Failed to fetch salaries.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to connect to the backend API.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (
    email: string,
    currentCommission: number,
    currentLocalSalary: number,
    currentEuroSalary: number
  ) => {
    setEditUserEmail(email);
    setNewCommission(currentCommission.toFixed(2));
    setNewLocalSalary(currentLocalSalary.toFixed(2));
    setNewEuroSalary(currentEuroSalary.toFixed(2));
    setUpdateMessage('');
    setUpdateError('');
  };

  const handleSaveUserChanges = async (email: string) => {
    setUpdateMessage('');
    setUpdateError('');
    const token = localStorage.getItem('authToken');

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const userToUpdate = salaries.find(user => user.email === email);
      if (!userToUpdate) {
        setUpdateError('User not found for update.');
        return;
      }

      const requests = [];

      if (parseFloat(newCommission) !== userToUpdate.commission) {
        requests.push(fetch('http://localhost:8000/api/commission', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            email,
            commission: parseFloat(newCommission),
          }),
        }));
      }

      if (
        parseFloat(newLocalSalary) !== userToUpdate.salary_local_currency ||
        parseFloat(newEuroSalary) !== userToUpdate.salary_euros
      ) {
        requests.push(fetch('http://localhost:8000/api/user-salary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            email,
            salary_local_currency: parseFloat(newLocalSalary),
            salary_euros: parseFloat(newEuroSalary),
          }),
        }));
      }

      if (requests.length === 0) {
        setUpdateMessage('No changes to save.');
        setEditUserEmail(null);
        return;
      }

      const responses = await Promise.all(requests);
      const allOk = responses.every(response => response.ok);

      if (allOk) {
        setUpdateMessage('User details updated successfully.');
        setEditUserEmail(null);
        setNewCommission('');
        setNewLocalSalary('');
        setNewEuroSalary('');
        fetchSalaries();
      } else {
        const errorData = await Promise.all(responses.map(res => res.json().catch(() => ({ message: 'Unknown error' }))));
        setUpdateError('Failed to update some user details: ' + errorData.map(d => d.message).join(', '));
        console.error('Error responses:', errorData);
      }
    } catch (err) {
      console.error('Update user details fetch error:', err);
      setError('Failed to connect to the backend API for user details update.');
    }
  };

  const handleDeleteUser = async (email: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    setLoading(true);
    setError('');
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(`http://localhost:8000/api/user/${email}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUpdateMessage('User deleted successfully');
        fetchSalaries();
      } else {
        setUpdateError(data.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setUpdateError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <Navbar />
      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl p-6 md:p-8 border border-white/20">
            <h1 className="text-4xl font-bold mb-8 text-center text-white tracking-tight">
              Admin Control Panel
            </h1>

            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-red-200">
                {error}
              </div>
            )}
            
            {updateMessage && (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6 text-green-200">
                {updateMessage}
              </div>
            )}
            
            {updateError && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 text-red-200">
                {updateError}
              </div>
            )}

            {!loading && !error && (salaries.length === 0 ? (
              <div className="text-center text-gray-300 py-8">
                No salary records found.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl">
                <table className="min-w-full divide-y divide-white/20">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="py-4 px-6 text-left text-sm font-semibold text-white/80">Name</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-white/80">Email</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-white/80">Local Salary</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-white/80">Euro Salary</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-white/80">Commission</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-white/80">Displayed Salary</th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-white/80">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {salaries.map((user) => (
                      <tr key={user.id} className="hover:bg-white/5 transition-colors duration-200">
                        <td className="py-4 px-6 text-sm text-white/90">{user.name}</td>
                        <td className="py-4 px-6 text-sm text-white/90">{user.email}</td>
                        <td className="py-4 px-6 text-sm text-white/90">
                          {editUserEmail === user.email ? (
                            <input
                              type="number"
                              value={newLocalSalary}
                              onChange={(e) => setNewLocalSalary(e.target.value)}
                              className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          ) : (
                            (user.salary_local_currency || 0).toFixed(2)
                          )}
                        </td>
                        <td className="py-4 px-6 text-sm text-white/90">
                          {editUserEmail === user.email ? (
                            <input
                              type="number"
                              value={newEuroSalary}
                              onChange={(e) => setNewEuroSalary(e.target.value)}
                              className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          ) : (
                            (user.salary_euros || 0).toFixed(2)
                          )}
                        </td>
                        <td className="py-4 px-6 text-sm text-white/90">
                          {editUserEmail === user.email ? (
                            <input
                              type="number"
                              value={newCommission}
                              onChange={(e) => setNewCommission(e.target.value)}
                              className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          ) : (
                            (user.commission || 0).toFixed(2)
                          )}
                        </td>
                        <td className="py-4 px-6 text-sm text-white/90">
                          {(user.displayed_salary || 0).toFixed(2)}
                        </td>
                        <td className="py-4 px-6 text-sm">
                          {editUserEmail === user.email ? (
                            <button
                              onClick={() => handleSaveUserChanges(user.email)}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                              Save
                            </button>
                          ) : (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditUser(
                                  user.email,
                                  user.commission,
                                  user.salary_local_currency,
                                  user.salary_euros
                                )}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.email)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage; 