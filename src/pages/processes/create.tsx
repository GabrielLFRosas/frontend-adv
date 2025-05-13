import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import ProtectedRoute from "../../components/ProtectedRoute";
import Sidebar from "../../components/Sidebar";
import { User } from "types";
import {
  createProcess,
  getAdvogados,
  getClientes,
  getEscritorios,
  getTipos,
} from "services/processes";

interface CreateProcessProps {
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
  dataInicio: string;
  dataEncerramento?: string;
}

export default function CreateProcess() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
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
      dataInicio: "",
      dataEncerramento: "",
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
        console.log(tiposData);
        setTipos(tiposData);
        setAdvogados(advogadosData);
        setEscritorios(escritoriosData);
        setClientes(clientesData);
      } catch (err) {
        setError("Erro ao carregar dados");
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await createProcess({
        numero: data.numero,
        tipoId: data.tipoId,
        advogadoId: data.advogadoId,
        escritorioId: data.escritorioId,
        clienteId: data.clienteId,
        descricao: data.descricao,
        valorCausa: parseFloat(String(data.valorCausa)).toFixed(2),
        percentualParticipacao: data.percentualParticipacao,
        status: data.status,
        dataInicio: data.dataInicio,
        dataEncerramento: data.dataEncerramento || undefined,
      });
      router.push("/processes");
    } catch (err) {
      setError("Erro ao criar processo");
    }
  };

  return (
    <ProtectedRoute >
      <div className="flex">
        <Sidebar />
        <div className="ml-64 flex-1">
          <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4">Criar Processo</h1>
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
                        {clientes.map((cliente) => (
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
                    {...register("dataInicio", {
                      required: "Data de início é obrigatória",
                    })}
                    className="w-full p-2 input-form"
                  />
                  {errors.dataInicio && (
                    <p className="text-red-500 text-sm">
                      {errors.dataInicio.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700">
                    Data de Encerramento (Opcional)
                  </label>
                  <input
                    type="date"
                    {...register("dataEncerramento")}
                    className="w-full p-2 input-form"
                  />
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
