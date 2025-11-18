import api from "../config/api";

const PRODUCT_API = "/products";

const productService = {
    getAll: (params) => api.get(PRODUCT_API, { params }),
    getById: (id) => api.get(`${PRODUCT_API}/${id}`),
    getTotalCount: () => api.get(`${PRODUCT_API}/total`),
    getActiveCount: () => api.get(`${PRODUCT_API}/active/total`),
    getLowStockCount : () => api.get(`${PRODUCT_API}/low-stock/total`),
    updateStatus: (id, data) => api.patch(`${PRODUCT_API}/toggle-status/${id}`, data ),
    create: (data) => api.post(PRODUCT_API, data),
    update: (id, data) => api.put(`${PRODUCT_API}/${id}`, data),
    delete: (id) => api.delete(`${PRODUCT_API}/${id}`),
};

export default productService;