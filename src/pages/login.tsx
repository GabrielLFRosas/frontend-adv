import Image from 'next/image';
import { useRouter } from 'next/router';
import { use, useState } from 'react';
import { useForm } from 'react-hook-form';

import Wallpaper from '../../public/wallpaper.jpg';
import Logo from '../../public/logo.png';
import { useAuth } from '../contexts/AuthContext';
import { LoginCredentials, User } from '../types';
import { login } from 'services/auth';

interface LoginProps {
  setUser: (user: User | null) => void;
}

interface FormData {
  email: string;
  senha: string;
}

export default function Login() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      email: '',
      senha: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError('');
    try {
      const credentials: LoginCredentials = { email: data.email, senha: data.senha };
      const { token, user } = await login(credentials);
      authLogin(token, user);
      router.push('/');
    } catch (err) {
      setError('Credenciais inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center background">
      <div className="box-login">
        <div>
          <Image src={Logo} alt='logo' width={200} />
        </div>
        {/* <h1 className="title-login mb-7">Login</h1> */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-96">
          <div>
            {/* <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              E-mail
            </label> */}
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'E-mail é obrigatório',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'E-mail inválido',
                },
              })}
              className={`w-full p-3 input-login ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="Digite seu e-mail"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            {/* <label htmlFor="senha" className="block text-gray-700 font-medium mb-1">
              Senha
            </label> */}
            <input
              id="senha"
              type="password"
              {...register('senha', {
                required: 'Senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'A senha deve ter pelo menos 6 caracteres',
                },
              })}
              className={`w-full p-3 input-login ${
                errors.senha ? 'border-red-500' : 'border-gray-300'
              } ${isLoading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="Digite sua senha"
              disabled={isLoading}
            />
            {errors.senha && (
              <p className="text-red-500 text-sm mt-1">{errors.senha.message}</p>
            )}
          </div>
          <button
            type="submit"
            className={`w-full p-2 login-btn ${
              isLoading
                ? 'background-login cursor-not-allowed'
                : 'background-login hover:background-login'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Carregando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}