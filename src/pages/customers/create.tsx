import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import { createCustomer, getEscritorios } from "../../services/customers";
import { User } from "../../types";
import ProtectedRoute from "../../components/ProtectedRoute";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "contexts/AuthContext";

interface CreateCustomerProps {
  user: User | null;
}

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  escritorioId: string;
}

export default function CreateCustomer() {
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
      telefone: "",
      escritorioId: "",
    },
  });
  const [escritorios, setEscritorios] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEscritorios = async () => {
      try {
        const escritoriosData = await getEscritorios();
        setEscritorios(escritoriosData);
      } catch (err) {
        setError("Erro ao carregar escritórios");
      }
    };
    fetchEscritorios();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await createCustomer({
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        escritorioId: data.escritorioId,
      });
      router.push("/customers");
    } catch (err) {
      setError("Erro ao criar cliente");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex">
        <Sidebar />
        <div className="ml-64 flex-1">
          <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4">Criar Cliente</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
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
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email é obrigatório",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Email inválido",
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
                    {...register("telefone", {
                      required: "Telefone é obrigatório",
                    })}
                    className="w-full p-2 input-form"
                  />
                  {errors.telefone && (
                    <p className="text-red-500 text-sm">
                      {errors.telefone.message}
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
              </div>
              <button
                type="submit"
                className="create-btn text-white p-2 "
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
