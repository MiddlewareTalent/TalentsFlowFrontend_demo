import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import url from '../../UniversalApi';

const JobRoles = () => {
  const [jobRoles, setJobRoles] = useState([]);
  const [newJobRole, setNewJobRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const tenantId = localStorage.getItem('company');
 const fetchJobRoles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/apis/employees/jobRoles/jobRoles`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Tenant-ID': tenantId,
        },
      });
      setJobRoles(response.data);
    } catch (err) {
      setError(err.message || 'Error fetching job roles');
    } finally {
      setLoading(false);
    }
  }, [token, tenantId]);

  useEffect(() => {
    fetchJobRoles();
  }, [fetchJobRoles]);

  const handleAddJobRole = async () => {
    if (!newJobRole.trim()) return;

    try {
      await axios.post(
        `${url}/apis/employees/jobRoles/addJobRole`,
        { jobRole: newJobRole },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Tenant-ID': tenantId,
          },
        }
      );
      setNewJobRole('');
      fetchJobRoles(); // Refresh the list
    } catch (err) {
      setError(err.message || 'Error adding job role');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Job Roles</h2>

      <div className="flex gap-3 mb-6 justify-center">
        <input
          type="text"
          value={newJobRole}
          onChange={(e) => setNewJobRole(e.target.value)}
          placeholder="Enter job role"
          className="border border-gray-300 rounded px-4 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAddJobRole}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </div>

      {loading ? (
        <p className="text-center text-blue-500">Loading job roles...</p>
      ) : error ? (
        <p className="text-center text-red-500">Error: {error}</p>
      ) : (
        <ul className="space-y-2">
          {jobRoles.map((role, index) => (
            <li
              key={index}
              className="px-4 py-2 bg-gray-100 rounded shadow-sm text-gray-700"
            >
              {role.jobRole}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobRoles;
