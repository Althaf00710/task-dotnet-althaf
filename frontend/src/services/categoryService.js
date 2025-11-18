import api from "../config/api";

const CATEGORY_API = "/categories";

const categoryService = {
    getAll: () => api.get(CATEGORY_API),
    getById: (id) => api.get(`${CATEGORY_API}/${id}`),
    getTotalCount: () => api.get(`${CATEGORY_API}/total`),
    getWithCount: () => api.get(`${CATEGORY_API}/with-count`),
    create: (data) => api.post(CATEGORY_API, data),
    update: (id, data) => api.put(`${CATEGORY_API}/${id}`, data),
    delete: (id) => api.delete(`${CATEGORY_API}/${id}`),
};

export default categoryService;