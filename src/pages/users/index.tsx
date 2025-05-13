import { useState, useEffect } from "react";
import Link from "next/link";

import Sidebar from "components/Sidebar";
import { User } from "types";
import { getUsers } from "services/user";
import ProtectedRoute from "components/ProtectedRoute";
import { useRouter } from "next/router";
import Loading from "components/Loading";
import EmptyState from "components/EmptyState";

interface UsersProps {
  user: User | null;
}

export default function Users() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const data = await getUsers();
      setUsers(data);
      setIsLoading(false);
    };
    fetchUsers();
  }, []);

  // const handleDelete = async (id: string) => {
  //   await deleteUser(id);
  //   setUsers(users.filter((u) => u.id !== id));
  // };

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="flex">
        <Sidebar />
        <div className="ml-64 flex-1">
          <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4 page-title">Usuários</h1>
            <div className="mb-4">
              <button
                onClick={() => router.push("/users/create")}
                className="p-2 create-btn text-white"
              >
                Novo Usuário
              </button>
            </div>
            {isLoading ? (
              <Loading />
            ) : users.length === 0 ? (
              <EmptyState
                message="Nenhum usuário encontrado"
                actionLabel="Criar Novo Usuário"
                onAction={() => router.push("/users/create")}
              />
            ) : (
              <>
                <table className="w-full border">
                  <thead className="table-header">
                    <tr>
                      <th className="border p-2">Nome</th>
                      <th className="border p-2">E-mail</th>
                      <th className="border p-2">Função</th>
                      <th className="border p-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td className="border p-2">{u.nome}</td>
                        <td className="border p-2">{u.email}</td>
                        <td className="border p-2">{u.role}</td>
                        <td className="border p-2">
                          <Link
                            href={`/users/edit/${u.id}`}
                            className="text-blue-500 mr-2"
                          >
                            Editar
                          </Link>
                          {/* <button onClick={() => handleDelete(u.id)} className="text-red-500">Excluir</button> */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
