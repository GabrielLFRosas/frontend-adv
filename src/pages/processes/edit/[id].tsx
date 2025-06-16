import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import ProtectedRoute from "components/ProtectedRoute";
import Sidebar from "components/Sidebar";
import { findProcess, getAdvogados, getClientes, getEscritorios, getTipos, updateProcess } from "services/processes";
import { Process, User } from "types";

interface EditProcessProps {
  user: User | null;
}

interface FormData {
  numero: string;
  tipoId: string;
  advogadoId: string;
  escritorioId: string;
  clienteId: string;
  descricao: string;
  valorCausa: number;
  percentualParticipacao: number;
  status: "EM_ANDAMENTO" | "ENCERRADO";
  dataVencimento: string;
  nrParcelas?: number;
}

export default function EditProcess() {
  const router = useRouter();
  const { id } = router.query;
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      numero: "",
      tipoId: "",
      advogadoId: "",
      escritorioId: "",
      clienteId: "",
      descricao: "",
      valorCausa: 0,
      percentualParticipacao: 0,
      status: "EM_ANDAMENTO" as "EM_ANDAMENTO",
      dataVencimento: "",
      nrParcelas: 1,
    },
  });
  const [tipos, setTipos] = useState<any[]>([]);
  const [advogados, setAdvogados] = useState<any[]>([]);
  const [escritorios, setEscritorios] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tiposData, advogadosData, escritoriosData, clientesData] =
          await Promise.all([
            getTipos(),
            getAdvogados(),
            getEscritorios(),
            getClientes(),
          ]);
        setTipos(tiposData);
        setAdvogados(advogadosData);
        setEscritorios(escritoriosData);
        setClientes(clientesData.customers);
      } catch (err) {
        setError("Erro ao carregar dados");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchProcess = async () => {
        try {
          const process = await findProcess(id as string);
          reset({
            numero: process.numero,
            tipoId: process.tipo.id,
            advogadoId: process.advogados[0].id,
            escritorioId: process.escritorio.id,
            clienteId: process.cliente.id,
            descricao: process.descricao,
            valorCausa: process.valorCausa,
            percentualParticipacao: process.advogados[0].percentualParticipacao,
            status: process.status,
            dataVencimento: process.dataVencimento,
            nrParcelas: process.nrParcelas
          });
        } catch (err) {
          setError("Erro ao carregar processo");
        }
      };
      fetchProcess();
    }
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await updateProcess(id as string, {
        numero: data.numero,
        tipoId: data.tipoId,
        advogadoId: data.advogadoId,
        escritorioId: data.escritorioId,
        clienteId: data.clienteId,
        descricao: data.descricao,
        valorCausa: parseFloat(String(data.valorCausa)).toFixed(2),
        percentualParticipacao: Number(data.percentualParticipacao),
        status: data.status,
        dataVencimento: data.dataVencimento,
        nrParcelas: Number(data.nrParcelas) || 1,
      });
      router.push("/processes");
    } catch (err) {
      setError("Erro ao atualizar processo");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <div className="ml-64 flex-1">
          <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4">Editar Processo</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid-form">
                <div>
                  <label className="block text-gray-700">
                    Número do Processo
                  </label>
                  <input
                    {...register("numero", {
                      required: "Número do processo é obrigatório",
                    })}
                    className="w-full p-2 input-form"
                  />
                  {errors.numero && (
                    <p className="text-red-500 text-sm">
                      {errors.numero.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700">Tipo</label>
                  <Controller
                    name="tipoId"
                    control={control}
                    rules={{ required: "Tipo é obrigatório" }}
                    render={({ field }) => (
                      <select {...field} className="w-full p-2 input-form">
                        <option value="">Selecione um tipo</option>
                        {tipos.map((tipo) => (
                          <option key={tipo.id} value={tipo.id}>
                            {tipo.nome}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.tipoId && (
                    <p className="text-red-500 text-sm">
                      {errors.tipoId.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700">Advogado</label>
                  <Controller
                    name="advogadoId"
                    control={control}
                    rules={{ required: "Advogado é obrigatório" }}
                    render={({ field }) => (
                      <select {...field} className="w-full p-2 input-form">
                        <option value="">Selecione um advogado</option>
                        {advogados.map((advogado) => (
                          <option key={advogado.id} value={advogado.id}>
                            {advogado.nome}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.advogadoId && (
                    <p className="text-red-500 text-sm">
                      {errors.advogadoId.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700">Escritório</label>
                  <Controller
                    name="escritorioId"
                    control={control}
                    rules={{ required: "Escritório é obrigatório" }}
                    render={({ field }) => (
                      <select {...field} className="w-full p-2 input-form">
                        <option value="">Selecione um escritório</option>
                        {escritorios.map((escritorio) => (
                          <option key={escritorio.id} value={escritorio.id}>
                            {escritorio.nome}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.escritorioId && (
                    <p className="text-red-500 text-sm">
                      {errors.escritorioId.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700">Cliente</label>
                  <Controller
                    name="clienteId"
                    control={control}
                    rules={{ required: "Cliente é obrigatório" }}
                    render={({ field }) => (
                      <select {...field} className="w-full p-2 input-form">
                        <option value="">Selecione um cliente</option>
                        {clientes?.map((cliente) => (
                          <option key={cliente.id} value={cliente.id}>
                            {cliente.nome}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.clienteId && (
                    <p className="text-red-500 text-sm">
                      {errors.clienteId.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-gray-700">Descrição</label>
                <textarea
                  {...register("descricao", {
                    required: "Descrição é obrigatória",
                  })}
                  className="w-full p-2 input-form"
                />
                {errors.descricao && (
                  <p className="text-red-500 text-sm">
                    {errors.descricao.message}
                  </p>
                )}
              </div>
              <div className="grid-form">
                <div>
                  <label className="block text-gray-700">Valor da Causa</label>
                  <input
                    type="number"
                    {...register("valorCausa", {
                      required: "Valor da causa é obrigatório",
                      min: {
                        value: 0,
                        message: "Valor da causa não pode ser negativo",
                      },
                    })}
                    className="w-full p-2 input-form"
                    step="0.01"
                  />
                  {errors.valorCausa && (
                    <p className="text-red-500 text-sm">
                      {errors.valorCausa.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700">Número de parcelas</label>
                  <input
                    type="number"
                    {...register("nrParcelas", {
                      min: {
                        value: 0,
                        message: "Número de parcelas não pode ser negativo",
                      },
                    })}
                    className="w-full p-2 input-form"
                    step="1"
                  />
                  {errors.nrParcelas && (
                    <p className="text-red-500 text-sm">
                      {errors.nrParcelas.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700">
                    Percentual de Participação (%)
                  </label>
                  <input
                    type="number"
                    {...register("percentualParticipacao", {
                      required: "Percentual de participação é obrigatório",
                      min: {
                        value: 0,
                        message: "Percentual não pode ser menor que 0",
                      },
                      max: {
                        value: 100,
                        message: "Percentual não pode ser maior que 100",
                      },
                    })}
                    className="w-full p-2 input-form"
                    step="0.01"
                  />
                  {errors.percentualParticipacao && (
                    <p className="text-red-500 text-sm">
                      {errors.percentualParticipacao.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700">Status</label>
                  <Controller
                    name="status"
                    control={control}
                    rules={{ required: "Status é obrigatório" }}
                    render={({ field }) => (
                      <select {...field} className="w-full p-2 input-form">
                        <option value="EM_ANDAMENTO">Em Andamento</option>
                        <option value="ENCERRADO">Encerrado</option>
                      </select>
                    )}
                  />
                  {errors.status && (
                    <p className="text-red-500 text-sm">
                      {errors.status.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700">Data de Início</label>
                  <input
                    type="date"
                    {...register("dataVencimento", {
                      required: "Data de vencimento é obrigatória",
                    })}
                    className="w-full p-2 input-form"
                  />
                  {errors.dataVencimento && (
                    <p className="text-red-500 text-sm">
                      {errors.dataVencimento.message}
                    </p>
                  )}
                </div>
                
                <div className="flex justify-end items-end">
                  <button
                    type="submit"
                    className="submit-btn p-2 h-max"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}