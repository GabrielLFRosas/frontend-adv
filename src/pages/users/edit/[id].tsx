import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { User } from 'types';
import ProtectedRoute from 'components/ProtectedRoute';
import Sidebar from 'components/Sidebar';
import Loading from 'components/Loading';
import { Controller, useForm } from 'react-hook-form';
import { findUser } from 'services/user';

interface EditUserProps {
  user: User | null;
}

interface FormData {
  nome: string;
  email: string;
  senha?: string;
  role: string;
}

export default function EditUser() {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      nome: '',
      email: '',
      senha: '',
      role: '',
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        try {
          setIsLoading(true);
          const userData = await findUser(id as string);
          reset({
            nome: userData.nome,
            email: userData.email,
            role: userData.role,
          });
        } catch (err) {
          setError('Erro ao carregar usuário');
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchUser();
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    if (!id) return;
    try {
      setIsLoading(true);
      // await updateUser(id as string, {
      //   nome: data.nome,
      //   email: data.email,
      //   senha: data.senha || undefined, // Enviar senha apenas se preenchida
      //   role: data.role,
      // });
      router.push('/users');
    } catch (err) {
      setError('Erro ao atualizar usuário');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !error) {
    return (
      <ProtectedRoute requiredRole="ADMIN">
        <div className="flex">
          <Sidebar />
          <div className="ml-64 flex-1">
            <Loading />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="flex">
        <Sidebar />
        <div className="ml-64 flex-1">
          <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4">Editar Usuário</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Nome</label>
                  <input
                    {...register('nome', { required: 'Nome é obrigatório' })}
                    className="w-full p-2 input-form"
                    disabled={isLoading}
                  />
                  {errors.nome && (
                    <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700">Senha (Opcional)</label>
                  <input
                    type="password"
                    {...register('senha', {
                      minLength: {
                        value: 6,
                        message: 'A senha deve ter pelo menos 6 caracteres',
                      },
                    })}
                    className="w-full p-2 input-form"
                    disabled={isLoading}
                  />
                  {errors.senha && (
                    <p className="text-red-500 text-sm mt-1">{errors.senha.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700">E-mail</label>
                  <input
                    {...register('email', {
                      required: 'E-mail é obrigatório',
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: 'E-mail inválido',
                      },
                    })}
                    className="w-full p-2 input-form"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700">Função</label>
                  <Controller
                    name="role"
                    control={control}
                    rules={{ required: 'Função é obrigatória' }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full p-2 input-form"
                        disabled={isLoading}
                      >
                        <option value="">Selecione uma função</option>
                        <option value="ADMIN">Admin</option>
                        <option value="ADVOGADO">Advogado</option>
                      </select>
                    )}
                  />
                  {errors.role && (
                    <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className={`w-full p-2  text-white font-medium submit-btn  ${
                  isLoading
                    ? 'background-login cursor-not-allowed'
                    : 'background-login hover:background-login'
                }`}
                disabled={isLoading}
              >
                {isLoading ? 'Salvando...' : 'Salvar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}