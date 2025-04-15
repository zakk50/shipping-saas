import React, { useState, useEffect } from 'react';
import { getMaterials } from '../../services/materials';

const MaterialsList = () => {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await getMaterials();
      setMaterials(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='flex'>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Materials</h2>
        <ul className="list-disc pl-4">
          {materials.map((mat) => (
            <li key={mat._id}>
              <h3 className="font-bold">{mat.title}</h3>
              <p>{mat.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MaterialsList;
