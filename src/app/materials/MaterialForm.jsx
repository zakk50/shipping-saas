import React, { useState } from 'react';
import { createMaterial } from '../../services/materials';

const MaterialForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createMaterial({ title, content, department });
      setTitle('');
      setContent('');
      setDepartment('');
    } catch (err) {
      console.error(err);
      setError('Failed to create material');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h2 className="text-xl font-bold mb-4">Create Material</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <label className="block mb-2">Title</label>
        <input
          type="text"
          className="border p-2 rounded w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Content</label>
        <textarea
          className="border p-2 rounded w-full"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Department</label>
        <input
          type="text"
          className="border p-2 rounded w-full"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Create
      </button>
    </form>
  );
};

export default MaterialForm;
