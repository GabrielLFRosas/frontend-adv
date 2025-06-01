import api from "./api";

export const getCustomers = async ({ page = 1, limit = 10 }: { page?: number; limit?: number }): Promise<any> => {
  const {data} = await api.get(`/cliente?page=${page}&limit=${limit}`);
  return data;
};

export const findCustomer = async (id: string): Promise<any> => {
  const response = await api.get("/cliente", {
    params: {
      id,
    },
  });
  return response.data;
};

export const createCustomer = async (customer: Omit<any, "id">): Promise<any> => {
  const response = await api.post("/cliente", customer);
  return response.data;
};

export const getEscritorios = async (): Promise<any[]> => {
  const response = await api.get("/escritorios");
  return response.data;
};

export const updateCustomer = async (
  id: string,
  data: Partial<any>
): Promise<any> => {
  const response = await api.patch(`/cliente/${id}`, data);
  return response.data;
};
