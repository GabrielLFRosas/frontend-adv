import Link from "next/link";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

import EmptyState from "components/EmptyState";
import Loading from "components/Loading";
import Sidebar from "components/Sidebar";
import { formatDate } from "utils/util";

import ProtectedRoute from "../../components/ProtectedRoute";
import { deleteFee, getFees } from "../../services/fees";
import { Fee, User } from "../../types";

interface FeesProps {
  user: User | null;
}

export default function Fees() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fees, setFees] = useState<any[]>([]);

  useEffect(() => {
    const fetchFees = async () => {
      setIsLoading(true);
      const data = await getFees();
      setFees(data);
      setIsLoading(false);
    };
    fetchFees();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteFee(id);
    setFees(fees.filter((f) => f.id !== id));
  };

  return (
    <ProtectedRoute >
      <div className="flex">
        <Sidebar />
        <div className="ml-64 flex-1">
          <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4 page-title">Honorários</h1>
            <div className="mb-4">
              <button
                onClick={() => router.push('/fees/create')}
                className="p-2 create-btn text-white"
              >
                Novo Honorário
              </button>
            </div>
            {isLoading ? (
              <Loading />
            ) : fees.length === 0 ? (
              <EmptyState
                message="Nenhum honorário encontrado"
                actionLabel="Criar Novo Honorário"
                onAction={() => router.push("/fees/create")}
              />
            ) : (
              <>
                <table className="w-full border">
                  <thead className="table-header">
                    <tr>
                      <th className="border p-2">Nº Processo</th>
                      <th className="border p-2">Valor (R$)</th>
                      <th className="border p-2">Previsão recebimento</th>
                      <th className="border p-2">Nº de parcelas</th>
                      <th className="border p-2">Status</th>
                      <th className="border p-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.map((f) => (
                      <tr key={f.id}>
                        <td className="border p-2">{f.processo.numero}</td>
                        <td className="border p-2">R$ {f.valor.toFixed(2)}</td>
                        <td className="border p-2">{formatDate(f.dataPrevistaRecebimento)}</td>
                        <td className="border p-2">{f.parcelas.length}</td>
                        <td className="border p-2">{f.recebido ? 'Recebido' : 'Pendente'}</td>
                        <td className="border p-2">
                          <Link
                            href={`/fees/edit/${f.id}`}
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
