import api from "./axios";

export function getChallans(params?: { page?: number; status?: string }) {
  return api.get("/challans", { params });
}

export function getChallan(id: string) {
  return api.get(`/challans/${id}`);
}

export function createChallan(data: any) {
  return api.post("/challans", data);
}

export function confirmChallan(id: string) {
  return api.post(`/challans/${id}/confirm`);
}

export function cancelChallan(id: string) {
  return api.post(`/challans/${id}/cancel`);
}

export function downloadChallanPdf(id: string) {
  return api.get(`/challans/${id}/pdf`, { responseType: "blob" });
}