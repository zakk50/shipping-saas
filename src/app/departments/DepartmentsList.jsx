import React, { useState, useEffect } from 'react';
import { getDepartments, createDepartment } from '../../services/departments';

const DepartmentsList = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await getDepartments();
      setDepartments(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load departments');
    }
  };

  const handleAddDepartment = async () => {
    if (!newDepartment) return;

    try {
      await createDepartment({ name: newDepartment, description });
      fetchDepartments(); // Обновляем список
      setNewDepartment('');
      setDescription('');
    } catch (err) {
      console.error(err);
      setError('Failed to add department');
    }
  };

  return (
    <div className="flex">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Departments</h2>
        {error && <p className="text-red-500">{error}</p>}
        <ul className="list-disc pl-4">
          {departments.map((dept) => (
            <li key={dept._id}>{dept.name} - {dept.description}</li>
          ))}
        </ul>
        <div className="mt-4">
          <input
            type="text"
            className="border p-2 rounded"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
            placeholder="Add new department"
          />
          <input
            type="text"
            className="border p-2 rounded ml-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <button
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleAddDepartment}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsList;
