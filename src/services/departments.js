import axios from './api';

export const getDepartments = () => axios.get('/api/departments');
export const createDepartment = (data) => axios.post('/api/departments', data);
