import { useState } from "react";
import { useRouter } from "next/router";
import { User } from "../../types";
import ProtectedRoute from "../../components/ProtectedRoute";
import Sidebar from "components/Sidebar";
import { createUser } from "services/user";
import { Controller, useForm } from "react-hook-form";

interface CreateUserProps {
  user: User | null;
}

interface FormData {
  nome: string;
  email: string;
  senha: string;
  role: string;
}

export default function CreateUser() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      role: "",
    },
  });
  const [error, setError] = useState("");

  const onSubmit = async (data: FormData) => {
    try {
      await createUser({  });
      router.push("/customers");
    } catch (err) {
      setError("Erro ao criar cliente");
    }
  };


  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="flex">
        <Sidebar />
        <div className="ml-64 flex-1">
          <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4">Criar Usuário</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid-form">
                <div>
                  <label className="block text-gray-700">Nome</label>
                  <input
                      {...register("nome", { required: "Nome é obrigatório" })}
                      className="w-full p-2 input-form"
                    />
                    {errors.nome && (
                      <p className="text-red-500 text-sm">{errors.nome.message}</p>
                    )}
                  
                </div>

                <div>
                  <label className="block text-gray-700">Senha</label>
                  <input
                      {...register("senha", { required: "Senha é obrigatória" })}
                      className="w-full p-2 input-form"
                      type="password"
                    />
                    {errors.senha && (
                      <p className="text-red-500 text-sm">{errors.senha.message}</p>
                    )}
                  
                </div>
                <div>
                  <label className="block text-gray-700">E-mail</label>
                  <input
                      {...register("email", { required: "E-mail é obrigatório" })}
                      className="w-full p-2 input-form"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">{errors.email.message}</p>
                    )}
                  
                </div>

                <div>
                    <label className="block text-gray-700">Função</label>
                    <Controller
                      name="role"
                      control={control}
                      rules={{ required: "Advogado é obrigatório" }}
                      render={({ field }) => (
                        <select {...field} className="w-full p-2 input-form">
                          <option value="">Selecione uma função</option>
                          <option value="ADMIN">Admin</option>
                          <option value="ADVOGADO">Advogado</option>
                          
                        </select>
                      )}
                    />
                    {errors.role && (
                      <p className="text-red-500 text-sm">
                        {errors.role.message}
                      </p>
                    )}
                  </div>
              </div>
              
              <button
                type="submit"
                className="submit-btn text-white p-2 "
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
