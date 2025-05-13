import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import Loading from 'components/Loading';
import ProtectedRoute from 'components/ProtectedRoute';
import Sidebar from 'components/Sidebar';
import { findCustomer, getEscritorios, updateCustomer } from 'services/customers';

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  escritorioId: string;
}

export default function EditCustomer() {
  const router = useRouter();
  const { id } = router.query;
  const [escritorios, setEscritorios] = useState<any[]>([]);
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
      nome: '',
      email: '',
      telefone: '',
      escritorioId: '',
    },
  });

  // Busca os escritórios para o select
  useEffect(() => {
    const fetchEscritorios = async () => {
      try {
        const escritoriosData = await getEscritorios();
        setEscritorios(escritoriosData);
      } catch (err) {
        setError('Erro ao carregar escritórios');
      }
    };
    fetchEscritorios();
  }, []);

  // Busca os dados do cliente e preenche o formulário
  useEffect(() => {
    if (id) {
      const fetchCustomer = async () => {
        setIsLoading(true);
        try {
          const customer = await findCustomer(id as string);
          console.log(customer)
          if (customer) {
            reset({
              nome: customer[0].nome || '',
              email: customer[0].email || '',
              telefone: customer[0].telefone || '',
              escritorioId: customer[0].escritorio.id || '',
            });
          } else {
            setError('Cliente não encontrado');
          }
        } catch (err) {
          setError('Erro ao carregar o cliente');
        } finally {
          setIsLoading(false);
        }
      };
      fetchCustomer();
    }
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    if (id) {
      setIsLoading(true);
      try {
        await updateCustomer(id as string, {
          nome: data.nome,
          email: data.email,
          telefone: data.telefone,
          escritorioId: data.escritorioId,
        });
        router.push('/customers');
      } catch (err) {
        setError('Erro ao atualizar cliente');
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
            <h1 className="text-2xl mb-4">Editar Cliente</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {isLoading ? (
              <Loading />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid-form">
                  <div>
                    <label className="block text-gray-700">Nome</label>
                    <input
                      {...register('nome', { required: 'Nome é obrigatório' })}
                      className="w-full p-2 input-form"
                    />
                    {errors.nome && (
                      <p className="text-red-500 text-sm">{errors.nome.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700">Email</label>
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email é obrigatório',
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: 'Email inválido',
                        },
                      })}
                      className="w-full p-2 input-form"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700">Telefone</label>
                    <input
                      {...register('telefone', {
                        required: 'Telefone é obrigatório',
                      })}
                      className="w-full p-2 input-form"
                    />
                    {errors.telefone && (
                      <p className="text-red-500 text-sm">{errors.telefone.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700">Escritório</label>
                    <Controller
                      name="escritorioId"
                      control={control}
                      rules={{ required: 'Escritório é obrigatório' }}
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
                      <p className="text-red-500 text-sm">{errors.escritorioId.message}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="create-btn text-white p-2"
                    disabled={isLoading}
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/customers')}
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