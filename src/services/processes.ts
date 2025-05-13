import { Process } from "../types";
import api from "./api";

export const getProcesses = async (
  page: number = 1,
  limit: number = 10
): Promise<{
  data: any[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}> => {
  const response = await api.get("/processo", {
    params: { page, limit },
  });
  return response.data;
};

export const findProcess = async (id: string) => { 
  const response = await api.get(`/processo/${id}`);
  return response.data;
}

export const createProcess = async (
  process: Omit<any, "id">
): Promise<Process> => {
  const response = await api.post("/processo", process);
  return response.data;
};

export const updateProcess = async (
  id: string,
  process: Partial<any>
): Promise<any> => {
  const response = await api.patch(`/processo/${id}`, process);
  return response.data;
};

export const removeProcess = async (id: string): Promise<void> => {
  await api.delete(`/processo/${id}`);
};

export const getTipos = async (): Promise<any[]> => {
  const response = await api.get("processo/tipo");
  return response.data;
};

export const getAdvogados = async (): Promise<any[]> => {
  const response = await api.get("/users?role=ADVOGADO");
  return response.data;
};

export const getEscritorios = async (): Promise<any[]> => {
  const response = await api.get("/escritorios");
  return response.data;
};

export const getClientes = async (): Promise<any[]> => {
  const response = await api.get("/cliente");
  return response.data;
};

