import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Loading from 'components/Loading';
import Sidebar from 'components/Sidebar';

import ProtectedRoute from '../../../components/ProtectedRoute';
import { findFee, getProcesses, updateFee } from '../../../services/fees';
import { Fee, Process } from '../../../types';

interface FormData {
  processoId: string;
  descricao: string;
  valor: number;
  dataPrevistaRecebimento: string;
  dataRecebido?: string;
  recebido: boolean;
  nrParcelas?: number;
}

export default function EditFee() {
  const router = useRouter();
  const { id } = router.query;
  const [processes, setProcesses] = useState<Process[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      processoId: '',
      descricao: '',
      valor: 0,
      dataPrevistaRecebimento: '',
      dataRecebido: '',
      recebido: false,
      nrParcelas: undefined,
    },
  });

  // Busca os processos para o select
  useEffect(() => {
    const fetchProcesses = async () => {
      try {
        const processesData = await getProcesses();
        setProcesses(processesData);
      } catch (err) {
        setError('Erro ao carregar processos');
      }
    };
    fetchProcesses();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchFee = async () => {
        setIsLoading(true);
        try {
          const fee = await findFee(id as string);
          if (fee) {
            reset({
              processoId: fee.processo.id || '',
              descricao: fee.descricao || '',
              valor: fee.valor || 0,
              dataPrevistaRecebimento: fee.dataPrevistaRecebimento
                ? new Date(fee.dataPrevistaRecebimento).toISOString().split('T')[0]
                : '',
              dataRecebido: fee.dataRecebido
                ? new Date(fee.dataRecebido).toISOString().split('T')[0]
                : '',
              recebido: fee.recebido || false,
              nrParcelas: fee.parcelas.lenght || undefined,
            });
          } else {
            setError('Honorário não encontrado');
          }
        } catch (err) {
          setError('Erro ao carregar o honorário');
        } finally {
          setIsLoading(false);
        }
      };
      fetchFee();
    }
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    if (id) {
      setIsLoading(true);
      try {
        await updateFee(id as string, {
          processoId: data.processoId,
          descricao: data.descricao,
          valor: data.valor,
          dataPrevistaRecebimento: data.dataPrevistaRecebimento,
          dataRecebido: data.dataRecebido || undefined,
          recebido: data.recebido,
          nrParcelas: data.nrParcelas || undefined,
        });
        router.push('/fees');
      } catch (err) {
        setError('Erro ao atualizar honorário');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <div className="ml-64 flex-1">
          <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4">Editar Honorário</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {isLoading ? (
              <Loading />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid-form">
                  <div>
                    <label className="block text-gray-700">Processo</label>
                    <Controller
                      name="processoId"
                      control={control}
                      rules={{ required: 'Processo é obrigatório' }}
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
                      {...register('descricao', {
                        required: 'Descrição é obrigatória',
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
                      {...register('valor', {
                        required: 'Valor é obrigatório',
                        min: { value: 0, message: 'Valor não pode ser negativo' },
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
                      {...register('dataPrevistaRecebimento', {
                        required: 'Data prevista é obrigatória',
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
                      {...register('dataRecebido')}
                      className="w-full p-2 input-form"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Número de Parcelas (Opcional)
                    </label>
                    <input
                      type="number"
                      {...register('nrParcelas', {
                        min: {
                          value: 1,
                          message: 'Número de parcelas deve ser pelo menos 1',
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
                        {...register('recebido')}
                        className="mr-2"
                      />
                      Recebido
                    </label>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="submit-btn p-2"
                    disabled={isLoading}
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/fees')}
                    className="bg-gray-500 text-white p-2 rounded"
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}