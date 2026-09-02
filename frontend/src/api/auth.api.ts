import api from "./axios";

export function loginApi(email: string, password: string) {
  return api.post("/auth/login", { email, password });
}