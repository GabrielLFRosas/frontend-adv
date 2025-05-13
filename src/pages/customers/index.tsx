import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import EmptyState from "components/EmptyState";
import Loading from "components/Loading";
import Sidebar from "components/Sidebar";
import { getCustomers } from "services/customers";

import ProtectedRoute from "../../components/ProtectedRoute";
import { User } from "../../types";

interface FeesProps {
  user: User | null;
}

export default function Customers() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fees, setFees] = useState<any[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      const data = await getCustomers();
      setFees(data);
      setIsLoading(false);
    };
    fetchCustomers();
  }, []);

  const handleDelete = async (id: string) => {
    // await deleteFee(id);
    setFees(fees.filter((f) => f.id !== id));
  };

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <div className="ml-64 flex-1">
          <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4 page-title">Clientes</h1>
            <div className="mb-4">
              <button
                onClick={() => router.push("/customers/create")}
                className="p-2 create-btn text-white"
              >
                Novo Cliente
              </button>
            </div>
            {isLoading ? (
              <Loading />
            ) : fees.length === 0 ? (
              <EmptyState
                message="Nenhum cliente encontrado"
                actionLabel="Criar Novo cliente"
                onAction={() => router.push("/customers/create")}
              />
            ) : (
              <>
                <table className="w-full border">
                  <thead className="table-header">
                    <tr>
                      <th className="border p-2">Nome</th>
                      <th className="border p-2">Email</th>
                      <th className="border p-2">Telefone</th>
                      <th className="border p-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.map((f) => (
                      <tr key={f.id}>
                        <td className="border p-2">{f.nome}</td>
                        <td className="border p-2">{f.email}</td>
                        <td className="border p-2">{f.telefone}</td>
                        <td className="border p-2">
                          <Link
                            href={`/customers/edit/${f.id}`}
                            className="text-blue-500 mr-2"
                          >
                            Editar
                          </Link>
                          <button
                            onClick={() => handleDelete(f.id)}
                            className="text-red-500"
                          >
                            Excluir
                          </button>
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
