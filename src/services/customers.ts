import api from "./api";

export const getCustomers = async (): Promise<any[]> => {
  const response = await api.get("/cliente");
  return response.data;
};

export const findCustomer = async (id: string): Promise<any> => {
  const response = await api.get("/cliente", {
    params: {
      id,
    },
  });
  return response.data;
};

export const createCustomer = async (fee: Omit<any, "id">): Promise<any> => {
  const response = await api.post("/fees", fee);
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
