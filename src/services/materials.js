import axios from './api';

export const getMaterials = () => axios.get('/api/materials');
export const createMaterial = (data) => axios.post('/api/materials', data);
