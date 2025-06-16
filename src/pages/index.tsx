import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

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
  const [privacyMode, setPrivacyMode] = useState(true); // Privacy mode on by default

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
    setPage(1); // Reset to first page on filter
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
    if (parcela.pago) return; // Already paid, do nothing

    setLoadingIds((ids) => [...ids, parcela.parcelaId]); // Lock checkbox

    try {
      await api.put(`/dashboard/parcela/${parcela.parcelaId}`);
      setSummary((old) => {
        if (!old) return old;
        const updatedProximos = old.proximosRecebimentos.map((p) =>
          p.parcelaId === parcela.parcelaId ? { ...p, pago: true } : p
        );
        return { ...old, proximosRecebimentos: updatedProximos };
      });
      await fetchFinancialSummary();
    } catch (error) {
      alert("Erro ao registrar pagamento da parcela.");
    } finally {
      setLoadingIds((ids) => ids.filter((id) => id !== parcela.parcelaId));
    }
  };

  const togglePrivacyMode = () => {
    setPrivacyMode((prev) => !prev);
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col md:flex-row min-h-screen">
        <Sidebar />
        <div className="flex-1 md:ml-64 p-4 sm:p-6">
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
                Painel Financeiro - Bem-vindo, {user?.nome || "Usuário"}!
              </h1>
              <button
                onClick={togglePrivacyMode}
                className="flex items-center space-x-2 text-sm sm:text-base text-gray-600 hover:text-gray-800"
              >
                {privacyMode ? (
                  <>
                    <IoMdEyeOff className="w-5 h-5" />
                    <span>Mostrar valores</span>
                  </>
                ) : (
                  <>
                    <IoMdEye className="w-5 h-5" />
                    <span>Ocultar valores</span>
                  </>
                )}
              </button>
            </div>
            {error && <p className="text-red-500 mb-4 text-sm sm:text-base">{error}</p>}
            {isLoading ? (
              <Loading />
            ) : (
              <>
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg mb-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                      <select
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value))}
                        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
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
                        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      >
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleFilter}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                      >
                        Filtrar
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                    <div className="bg-green-100 p-4 rounded-lg shadow">
                      <h2 className="text-lg font-semibold text-green-800">
                        Valor Previsto
                      </h2>
                      <p className="text-xl sm:text-2xl font-bold text-green-600">
                        {privacyMode
                          ? "••••"
                          : typeof summary?.valorPrevisto === "number"
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
                      <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                        {privacyMode
                          ? "••••"
                          : typeof summary?.valorRecebido === "number"
                          ? summary.valorRecebido.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })
                          : "R$ 0,00"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                      Próximos Recebimentos
                    </h2>
                    {summary?.proximosRecebimentos.length === 0 ? (
                      <p className="text-gray-600 text-sm sm:text-base">
                        Nenhum recebimento previsto para este mês.
                      </p>
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <table className="min-w-full border text-sm sm:text-base">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="border p-2 sm:p-3 text-left text-gray-700">
                                  Processo
                                </th>
                                <th className="border p-2 sm:p-3 text-left text-gray-700">
                                  Descrição
                                </th>
                                <th className="border p-2 sm:p-3 text-left text-gray-700">
                                  Valor
                                </th>
                                <th className="border p-2 sm:p-3 text-left text-gray-700">
                                  Data de vencimento
                                </th>
                                <th className="border p-2 sm:p-3 text-left text-gray-700">
                                  Pago
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {summary?.proximosRecebimentos.map(
                                (parcela: Fee, index: number) => (
                                  <tr key={index} className="hover:bg-gray-100">
                                    <td className="border p-2 sm:p-3">
                                      {parcela.processoNumero}
                                    </td>
                                    <td className="border p-2 sm:p-3">
                                      {parcela.descricao}
                                    </td>
                                    <td className="border p-2 sm:p-3">
                                      {privacyMode
                                        ? "••••"
                                        : parcela.valor.toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                          })}
                                    </td>
                                    <td className="border p-2 sm:p-3">
                                      {new Date(
                                        parcela.dataPrevistaRecebimento
                                      ).toLocaleDateString("pt-BR")}
                                    </td>
                                    <td className="border p-2 sm:p-3">
                                      <input
                                        type="checkbox"
                                        checked={parcela.pago}
                                        disabled={
                                          parcela.pago ||
                                          loadingIds.includes(parcela.parcelaId)
                                        }
                                        onChange={() => handleTogglePago(parcela)}
                                        className="cursor-pointer"
                                      />
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                        {summary?.pagination && (
                          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
                            <div className="text-gray-600 text-sm">
                              Mostrando {summary.proximosRecebimentos.length} de{" "}
                              {summary.pagination.total} parcelas
                            </div>
                            <div className="flex space-x-2">
                              <button
                                disabled={page === 1}
                                onClick={() => handlePageChange(page - 1)}
                                className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 text-sm"
                              >
                                Anterior
                              </button>
                              <span className="text-sm">
                                Página {summary.pagination.page} de{" "}
                                {summary.pagination.totalPages}
                              </span>
                              <button
                                disabled={page === summary.pagination.totalPages}
                                onClick={() => handlePageChange(page + 1)}
                                className="px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 text-sm"
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