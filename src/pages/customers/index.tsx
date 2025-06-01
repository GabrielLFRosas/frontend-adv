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
  const [pagination, setPagination] = useState<{
    page: number;
    total: number;
    totalPages: number;
  }>({ page: 1, total: 0, totalPages: 0 });

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      const data = await getCustomers({ page: pagination.page, limit: 10 });
      setFees(data.customers);
      setPagination({
        page: data.page,
        total: data.total,
        totalPages: data.totalPages,
      });
      setIsLoading(false);
    };
    fetchCustomers();
  }, [pagination.page]);

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
                {pagination && (
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <p className="text-gray-600">
                        Mostrando {fees.length} de {pagination.total} clientes
                      </p>
                    </div>
                    <div className="space-x-2">
                      <button
                        disabled={pagination.page === 1}
                        onClick={() => handlePageChange(pagination.page - 1)}
                        className="p-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300"
                      >
                        Anterior
                      </button>
                      <span>
                        Página {pagination.page} de {pagination.totalPages}
                      </span>
                      <button
                        disabled={pagination.page === pagination.totalPages}
                        onClick={() => handlePageChange(pagination.page + 1)}
                        className="p-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300"
                      >
                        Próximo
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}