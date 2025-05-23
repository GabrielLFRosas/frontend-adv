import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import EmptyState from 'components/EmptyState';
import Loading from 'components/Loading';
import { formatDate } from 'utils/util';

import ProtectedRoute from '../../components/ProtectedRoute';
import Sidebar from '../../components/Sidebar';
import { getProcesses, removeProcess } from '../../services/processes';
import { Process, User } from '../../types';

interface ProcessesProps {
  user: User | null;
}

export default function Processes() {
  const router = useRouter();
  const [processes, setProcesses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [metaReq, setMeta] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 1,
  });
  const [error, setError] = useState('');

  const fetchProcesses = async (page: number) => {
    setIsLoading(true)
    try {
      const { data, meta } = await getProcesses(page, metaReq.limit);
      setProcesses(data);
      setMeta(meta);
      setIsLoading(false);
    } catch (err) {
      setError('Erro ao carregar processos');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProcesses(metaReq.page);
  }, [metaReq.page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= metaReq.totalPages) {
      setMeta((prev) => ({ ...prev, page: newPage }));
    }
  };

  const deleteProcess = async (id: string) => {
    try {
      await removeProcess(id);
      setProcesses((prev) => prev.filter((process) => process.id !== id));
    } catch (err) {
      setError('Erro ao excluir processo');
    }
  }

  const getLabelStatus = (status: string) => {
    switch (status) {
      case 'EM_ANDAMENTO':
        return 'Em Andamento';
      case 'ENCERRADO':
        return 'Encerrado';
      default:
        return status;
    }
  }

  return (
    <ProtectedRoute >
      <div className="flex">
        <Sidebar />
        <div className="ml-64 flex-1">
          <div className="container mx-auto p-4">
            <h1 className="text-2xl mb-4 page-title">Processos</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
              <button
                onClick={() => router.push('/processes/create')}
                className="p-2 create-btn text-white"
              >
                Novo Processo
              </button>
            </div>
            {isLoading ? (
              <Loading />
            ) : processes.length === 0 ? (
              <EmptyState
                message="Nenhum processo encontrado"
                actionLabel="Criar Novo Processo"
                onAction={() => router.push("/processes/create")}
              />
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full border">
                    <thead className='table-header'>
                      <tr>
                        <th className="border p-2">Número</th>
                        <th className="border p-2">Tipo</th>
                        <th className="border p-2">Cliente</th>
                        <th className="border p-2">Escritório</th>
                        <th className="border p-2">Descrição</th>
                        <th className="border p-2">Valor da Causa</th>
                        <th className="border p-2">Número de parcelas</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Data de vencimento</th>
                        <th className="border p-2">Advogados</th>
                        <th className="border p-2">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processes.map((process) => (
                        <tr key={process.id}>
                          <td className="border p-2">{process.numero}</td>
                          <td className="border p-2">{process.tipo?.nome || '-'}</td>
                          <td className="border p-2">{process.cliente?.nome || '-'}</td>
                          <td className="border p-2">{process.escritorio?.nome || '-'}</td>
                          <td className="border p-2">{process.descricao}</td>
                          <td className="border p-2">{process.valorCausa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                          <td className="border p-2">{process.nrParcelas}</td>
                          <td className="border p-2">{getLabelStatus(process.status)}</td>
                          <td className="border p-2">{formatDate(process.dataVencimento)}</td>
                          <td className="border p-2">
                            {process.advogados?.map((adv: any, idx: number) => (
                              <div key={idx}>
                                {adv.nome} ({adv.percentualParticipacao}%)
                              </div>
                            ))}
                          </td>
                          <td className="border p-2">
                            <button
                              onClick={() => router.push(`/processes/edit/${process.id}`)}
                              className="text-blue-500 hover:underline mr-2"
                            >
                              Editar
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm('Tem certeza que deseja excluir este processo?')) {
                                  await deleteProcess(process.id);
                                  fetchProcesses(metaReq.page);
                                }
                              }}
                              className="text-red-500 hover:underline"
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div>
                    <p>
                      Mostrando {processes.length} de {metaReq.total} processos (Página {metaReq.page} de {metaReq.totalPages})
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handlePageChange(metaReq.page - 1)}
                      disabled={metaReq.page === 1}
                      className="p-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => handlePageChange(metaReq.page + 1)}
                      disabled={metaReq.page === metaReq.totalPages}
                      className="p-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                      Próximo
                    </button>
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