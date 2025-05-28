import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";

import Loading from "components/Loading";
import ProtectedRoute from "components/ProtectedRoute";
import Sidebar from "components/Sidebar";
import { useAuth } from "contexts/AuthContext";
import api from "services/api";

interface Fee {
  parcelaId: string;
  processoNumero: string;
  descricao: string;
  valor: number;
  dataPrevistaRecebimento: string;
  pago: boolean;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface FinancialSummary {
  valorPrevisto: number;
  valorRecebido: number;
  proximosRecebimentos: Fee[];
  pagination: Pagination;
}

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  const fetchFinancialSummary = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/dashboard/financeiro", {
        params: { month, year, page, limit },
      });
      setSummary(response.data);
    } catch (err) {
      setError("Erro ao carregar dados financeiros");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialSummary();
  }, [month, year, page]);

  const handleFilter = () => {
    setPage(1); // Reseta para a primeira página ao aplicar filtro
    fetchFinancialSummary();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - 2 + i
  );

  const handleTogglePago = async (parcela: Fee) => {
    if (parcela.pago) return; // já pago, não faz nada

    setLoadingIds((ids) => [...ids, parcela.parcelaId]); // bloqueia checkbox

    try {
      // Chama endpoint PUT /parcela/:id (assumindo processoNumero é o id correto)
      await api.put(`/dashboard/parcela/${parcela.parcelaId}`);
      // Atualiza localmente o estado para re-renderizar como pago
      setSummary((old) => {
        if (!old) return old;
        const updatedProximos = old.proximosRecebimentos.map((p) =>
          p.parcelaId === parcela.parcelaId ? { ...p, pago: true } : p
        );
        return { ...old, proximosRecebimentos: updatedProximos };
      });
      await fetchFinancialSummary()
    } catch (error) {
      alert("Erro ao registrar pagamento da parcela.");
    } finally {
      setLoadingIds((ids) => ids.filter((id) => id !== parcela.parcelaId));
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <div className="ml-64 flex-1">
          <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Painel Financeiro - Bem-vindo, {user?.nome || "Usuário"}!
            </h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {isLoading ? (
              <Loading />
            ) : (
              <>
                <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="space-x-4">
                      <select
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value))}
                        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {months.map((m) => (
                          <option key={m} value={m}>
                            {new Date(0, m - 1).toLocaleString("pt-BR", {
                              month: "long",
                            })}
                          </option>
                        ))}
                      </select>
                      <select
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleFilter}
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Filtrar
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-green-100 p-4 rounded-lg shadow">
                      <h2 className="text-lg font-semibold text-green-800">
                        Valor Previsto
                      </h2>
                      <p className="text-2xl font-bold text-green-600">
                        {typeof summary?.valorPrevisto === "number"
                          ? summary.valorPrevisto.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })
                          : "R$ 0,00"}
                      </p>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded-lg shadow">
                      <h2 className="text-lg font-semibold text-yellow-800">
                        Valor Recebido
                      </h2>
                      <p className="text-2xl font-bold text-yellow-600">
                        {typeof summary?.valorRecebido === "number"
                          ? summary.valorRecebido.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })
                          : "R$ 0,00"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      Próximos Recebimentos
                    </h2>
                    {summary?.proximosRecebimentos.length === 0 ? (
                      <p className="text-gray-600">
                        Nenhum recebimento previsto para este mês.
                      </p>
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <table className="min-w-full border">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="border p-2 text-left text-gray-700">
                                  Processo
                                </th>
                                <th className="border p-2 text-left text-gray-700">
                                  Descrição
                                </th>
                                <th className="border p-2 text-left text-gray-700">
                                  Valor
                                </th>
                                <th className="border p-2 text-left text-gray-700">
                                  Data de vencimento
                                </th>
                                <th className="border p-2 text-left text-gray-700">
                                  Pago
                                </th>
                                
                              </tr>
                            </thead>
                            <tbody>
                              {summary?.proximosRecebimentos.map(
                                (parcela: Fee, index: number) => (
                                  <tr key={index} className="hover:bg-gray-100">
                                    <td className="border p-2">
                                      {parcela.processoNumero}
                                    </td>
                                    <td className="border p-2">
                                      {parcela.descricao}
                                    </td>
                                    <td className="border p-2">
                                      {parcela.valor.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                      })}
                                    </td>
                                    <td className="border p-2">
                                      {new Date(
                                        parcela.dataPrevistaRecebimento
                                      ).toLocaleDateString("pt-BR")}
                                    </td>
                                    <td className="border p-2">
                                      <input
                                        type="checkbox"
                                        checked={parcela.pago}
                                        disabled={
                                          parcela.pago ||
                                          loadingIds.includes(
                                            parcela.processoNumero
                                          )
                                        }
                                        onChange={() =>
                                          handleTogglePago(parcela)
                                        }
                                        className="cursor-pointer"
                                      />
                                    </td>
                                    
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                        {/* Paginação */}
                        {summary?.pagination && (
                          <div className="flex justify-between items-center mt-4">
                            <div>
                              <p className="text-gray-600">
                                Mostrando {summary.proximosRecebimentos.length}{" "}
                                de {summary.pagination.total} parcelas
                              </p>
                            </div>
                            <div className="space-x-2">
                              <button
                                disabled={page === 1}
                                onClick={() => handlePageChange(page - 1)}
                                className="p-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300"
                              >
                                Anterior
                              </button>
                              <span>
                                Página {summary.pagination.page} de{" "}
                                {summary.pagination.totalPages}
                              </span>
                              <button
                                disabled={
                                  page === summary.pagination.totalPages
                                }
                                onClick={() => handlePageChange(page + 1)}
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
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
