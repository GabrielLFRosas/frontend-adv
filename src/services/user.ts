import api from "./api";
import { User } from "../types";

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get("users");
  return response.data;
};

export const findUser = async (id: string): Promise<any> => {
  const response = await api.get(`users/${id}`);
  return response.data;
};

export const createUser = async (user: Omit<any, "id">): Promise<any> => {
  const response = await api.post("users", user);
  return response.data;
};

// export const updateUser = async (id: string, user: Partial<User>): Promise<User> => {
//   const response = await api.put(`users/${id}`, user);
//   return response.data;
// };

// export const deleteUser = async (id: string): Promise<void> => {
//   await api.delete(`users/${id}`);
// };
