import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import { createFee, getProcesses } from "../../services/fees";
import { User, Process } from "../../types";
import ProtectedRoute from "../../components/ProtectedRoute";
import Sidebar from "../../components/Sidebar";

interface CreateFeeProps {
  user: User | null;
}

interface FormData {
  processoId: string;
  descricao: string;
  valor: number;
  dataPrevistaRecebimento: string;
  dataRecebido?: string;
  recebido: boolean;
  nrParcelas?: number;
}

export default function CreateFee() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      processoId: "",
      descricao: "",
      valor: 0,
      dataPrevistaRecebimento: "",
      dataRecebido: "",
      recebido: false,
      nrParcelas: undefined,
    },
  });
  const [processes, setProcesses] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const processesData = await getProcesses();
        setProcesses(processesData);
      } catch (err) {
        setError("Erro ao carregar processos");
      }
    };
    fetchProcesses();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await createFee({
        processoId: data.processoId,
        descricao: data.descricao,
        valor: data.valor,
        dataPrevistaRecebimento: data.dataPrevistaRecebimento,
        dataRecebido: data.dataRecebido || undefined,
        recebido: data.recebido,
        nrParcelas: data.nrParcelas || undefined,
      });
      router.push("/fees");
    } catch (err) {
      setError("Erro ao criar honorário");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <div className="ml-64 flex-1">
          <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4">Criar Honorário</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid-form">
                <div>
                  <label className="block text-gray-700">Processo</label>
                  <Controller
                    name="processoId"
                    control={control}
                    rules={{ required: "Processo é obrigatório" }}
                    render={({ field }) => (
                      <select {...field} className="w-full p-2 input-form">
                        <option value="">Selecione um processo</option>
                        {processes?.map((process) => (
                          <option key={process.id} value={process.id}>
                            {process.numero}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.processoId && (
                    <p className="text-red-500 text-sm">
                      {errors.processoId.message}
                    </p>
                  )}
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
                <div>
                  <label className="block text-gray-700">Valor</label>
                  <input
                    type="number"
                    {...register("valor", {
                      required: "Valor é obrigatório",
                      min: { value: 0, message: "Valor não pode ser negativo" },
                    })}
                    className="w-full p-2 input-form"
                    step="0.01"
                  />
                  {errors.valor && (
                    <p className="text-red-500 text-sm">{errors.valor.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700">
                    Data Prevista de Recebimento
                  </label>
                  <input
                    type="date"
                    {...register("dataPrevistaRecebimento", {
                      required: "Data prevista é obrigatória",
                    })}
                    className="w-full p-2 input-form"
                  />
                  {errors.dataPrevistaRecebimento && (
                    <p className="text-red-500 text-sm">
                      {errors.dataPrevistaRecebimento.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700">
                    Data de Recebimento (Opcional)
                  </label>
                  <input
                    type="date"
                    {...register("dataRecebido")}
                    className="w-full p-2 input-form"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700">
                    Número de Parcelas (Opcional)
                  </label>
                  <input
                    type="number"
                    {...register("nrParcelas", {
                      min: {
                        value: 1,
                        message: "Número de parcelas deve ser pelo menos 1",
                      },
                    })}
                    className="w-full p-2 input-form"
                  />
                  {errors.nrParcelas && (
                    <p className="text-red-500 text-sm">
                      {errors.nrParcelas.message}
                    </p>
                  )}
                </div>
                <div className="flex items-end">
                  <label className="block text-gray-700">
                    <input
                      type="checkbox"
                      {...register("recebido")}
                      className="mr-2"
                    />
                    Recebido
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className=" submit-btn p-2 "
              >
                Salvar
              </button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
