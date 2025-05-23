import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Loading from "components/Loading";
import ProtectedRoute from "components/ProtectedRoute";
import Sidebar from "components/Sidebar";
import { useAuth } from "contexts/AuthContext";
import api from "services/api";
import { User } from "types";

interface Fee {
  processoNumero: string;
  descricao: string;
  valor: number;
  dataPrevistaRecebimento: string;
}

interface FinancialSummary {
  totalHonorariosPrevistos: number;
  totalHonorariosRecebidos: number;
  parcelasPendentes: Fee[];
}

interface HomeProps {
  user: any | null;
}

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // const fetchFinancialSummary = async () => {
  //   setIsLoading(true);
  //   try {
  //     const response = await api.get(
  //       "/dashboard/financeiro",
  //       {
  //         params: { month, year },
  //       }
  //     );
  //     setSummary(response.data);
  //   } catch (err) {
  //     setError("Erro ao carregar dados financeiros");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchFinancialSummary();
  // }, [month, year]);

  // const handleFilter = () => {
  //   fetchFinancialSummary();
  // };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - 2 + i
  );

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
                        // onClick={handleFilter}
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Filtrar
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-green-100 p-4 rounded-lg shadow">
                      <h2 className="text-lg font-semibold text-green-800">
                        Honorários Previstos
                      </h2>
                      <p className="text-2xl font-bold text-green-600">
                        {typeof summary?.totalHonorariosPrevistos === "number"
                          ? summary.totalHonorariosPrevistos.toLocaleString(
                              "pt-BR",
                              {
                                style: "currency",
                                currency: "BRL",
                              }
                            )
                          : "R$ 0,00"}
                      </p>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded-lg shadow">
                      <h2 className="text-lg font-semibold text-yellow-800">
                        Honorários Recebidos
                      </h2>
                      <p className="text-2xl font-bold text-yellow-600">
                        {typeof summary?.totalHonorariosRecebidos === "number"
                          ? summary.totalHonorariosRecebidos.toLocaleString(
                              "pt-BR",
                              {
                                style: "currency",
                                currency: "BRL",
                              }
                            )
                          : "R$ 0,00"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      Parcelas a Vencer no Mês
                    </h2>
                    {summary?.parcelasPendentes.length === 0 ? (
                      <p className="text-gray-600">
                        Nenhuma parcela a vencer neste mês.
                      </p>
                    ) : (
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
                                Data Prevista
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {summary?.parcelasPendentes.map(
                              (parcela: any, index: number) => (
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
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
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
