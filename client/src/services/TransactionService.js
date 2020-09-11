import http from '../http-common';

const getAll = async () => {
  return await http.get('/transaction');
};

const get = (period) => {
  return http.get(`/transaction?period=${period}`);
};

const create = (data) => {
  return http.post('/transaction', data);
};

const update = (id, data) => {
  return http.patch(`/transaction/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/transaction/${id}`);
};

const removeAll = () => {
  return http.delete(`/transaction`);
};

const findByName = (name) => {
  return http.get(`/grade?name=${name}`);
};

export default {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll,
  findByName,
};
