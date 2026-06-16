export type AuditLog = {
  id: string;
  who: string;
  date: string;
  time: string;
  occurredAt: string;
  action: string;
  actionLabel: string;
  what: string;
  path: string | null;
  method: string | null;
  statusCode: number | null;
};

const API_URL = import.meta.env.VITE_API_URL_PRODUTION;

type RawAuditLog = Partial<AuditLog> & {
  actor?: {
    name?: string;
    email?: string;
    userId?: string;
    rolesCount?: number;
    rolesPreview?: string[];
  };
  summary?: {
    action?: string;
    label?: string;
    resource?: string | null;
    statusCode?: number | null;
    what?: string;
  };
  createdAt?: { seconds?: number; nanoseconds?: number } | string;
  createdAtISO?: string;
  requestPayload?: unknown;
  responsePayload?: unknown;
};

const toTextDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(date);
};

const toTextTime = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", { timeStyle: "medium" }).format(date);
};

const mapAuditLog = (item: RawAuditLog): AuditLog => {
  const occurredAt = item.occurredAt || item.createdAtISO || (typeof item.createdAt === "string" ? item.createdAt : "");
  const who = item.who || item.actor?.name || "Sem nome";
  const action = item.action || item.summary?.action || "";
  const actionLabel = item.actionLabel || item.summary?.label || "";
  const what = item.what || item.summary?.what || actionLabel || action || "Evento de auditoria";
  const path = item.path ?? item.summary?.resource ?? null;
  const statusCode = item.statusCode ?? item.summary?.statusCode ?? null;

  return {
    id: item.id || occurredAt || `${who}-${what}`,
    who,
    date: item.date || toTextDate(occurredAt),
    time: item.time || toTextTime(occurredAt),
    occurredAt,
    action,
    actionLabel,
    what,
    path,
    method: item.method ?? null,
    statusCode,
  };
};

export const fetchAuditLogs = async (): Promise<AuditLog[]> => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/audit`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      data?.message ||
        data?.error ||
        (response.status === 401
          ? "Token ausente ou invalido."
          : response.status === 400
            ? "Filtro invalido."
            : "Erro ao carregar auditoria.")
    );
  }

  const data = await response.json();
  const list = Array.isArray(data)
    ? data
    : Array.isArray(data?.logs)
      ? data.logs
      : Array.isArray(data?.results)
        ? data.results
        : [];

  return list.map(mapAuditLog);
};
