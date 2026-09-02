import api from "./axios";

export function getCustomers(params?: { page?: number; search?: string; status?: string }) {
  return api.get("/customers", { params });
}

export function getCustomer(id: string) {
  return api.get(`/customers/${id}`);
}

export function createCustomer(data: any) {
  return api.post("/customers", data);
}

export function updateCustomer(id: string, data: any) {
  return api.put(`/customers/${id}`, data);
}

export function addCustomerNote(id: string, note: string) {
  return api.post(`/customers/${id}/notes`, { note });
}