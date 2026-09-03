import api from "./axios";

export function getProducts(params?: { page?: number; search?: string; lowStock?: boolean }) {
  return api.get("/products", { params });
}

export function getProduct(id: string) {
  return api.get(`/products/${id}`);
}

export function createProduct(data: any) {
  return api.post("/products", data);
}

export function updateProduct(id: string, data: any) {
  return api.put(`/products/${id}`, data);
}

export function uploadProductImage(id: string, file: File) {
  const formData = new FormData();
  formData.append("image", file);
  return api.post(`/products/${id}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}