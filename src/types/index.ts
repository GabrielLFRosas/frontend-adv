export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'ADVOGADO';
}

export interface Process {
  id: string;
  numero: string;
  tipoId: string;
  advogadoId: string;
  escritorioId: string;
  clienteId: string;
  descricao: string;
  valorCausa: any;
  percentualParticipacao: number;
  status: 'EM_ANDAMENTO' | 'ENCERRADO';
  dataInicio: string;
  dataEncerramento?: string;
}

export interface Fee {
  id: string;
  processoId: string;
  descricao: string;
  valor: number;
  dataPrevistaRecebimento: string;
  dataRecebido?: string;
  recebido: boolean;
  nrParcelas?: number;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}