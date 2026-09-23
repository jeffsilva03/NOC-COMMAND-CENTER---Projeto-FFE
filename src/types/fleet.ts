export interface Vehicle {
  id: string;
  modelo: string;
  tipo: string;
  vel: string;
  latitude: string;
  longitude: string;
  ultima_atualizacao?: string;
}

export interface TelemetryData {
  name: string;
  velocidade: number;
}

export interface DashboardSystem {
  totalVeiculos: number;
  veiculosOnline: number;
  veiculosOffline: number;
  alertas: number;
  uptime: number;
  velocidadeMedia: number;
  linksOnline: number;
  totalLinks: number;
  status: 'OPERACIONAL' | 'DEGRADADO';
}

export interface DashboardLink {
  id: number;
  nome: string;
  target: string;
  latencia_ms: number;
  trafego_percentual: number;
  online: number;
  ultima_atualizacao: string;
}

export interface DashboardCategory {
  tipo: string;
  total: number;
  velocidadeMedia: number;
  linkId: number;
  online: boolean;
  sinal: number;
}

export interface DashboardHistory {
  id: number;
  velocidade_media: number;
  criado_em: string;
}

export interface DashboardIncident {
  id: number;
  nivel: 'INFO' | 'WARNING' | 'CRITICAL';
  mensagem: string;
  link_id: number | null;
  link_nome: string | null;
  criado_em: string;
}

export interface DashboardLog {
  id: number;
  metodo: string;
  endpoint: string;
  status: number;
  latencia_ms: number;
  criado_em: string;
}

export interface DashboardData {
  sistema: DashboardSystem;

  links: DashboardLink[];

  categorias: DashboardCategory[];

  historicoVelocidade: DashboardHistory[];

  incidentes: DashboardIncident[];

  logs: DashboardLog[];
}