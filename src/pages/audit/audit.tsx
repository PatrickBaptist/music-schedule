import React, { useEffect, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import PageWrapper from "../../components/pageWrapper/pageWrapper";
import LoadingScreen from "../../components/loading/LoadingScreen";
import { AuditLog, fetchAuditLogs } from "../../services/AuditService";
import {
  AuditCard,
  AuditContainer,
  AuditHeader,
  AuditList,
  AuditPageShell,
  EmptyState,
  HeaderActions,
  RefreshButton,
} from "./auditStyle";

const formatDateTime = (date: string, time: string) => {
  if (!date && !time) return "-";
  if (!date) return time;
  if (!time) return date;
  return `${date} ${time}`;
};

const AuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = async (showSpinner: boolean) => {
    if (showSpinner) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    setError(null);

    try {
      const data = await fetchAuditLogs();
      setLogs(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar auditoria.";
      setError(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    void loadLogs(true);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      void loadLogs(false);
    }, 15000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <PageWrapper>
      <AuditPageShell>
        <AuditContainer>
          <AuditHeader>
            <h1>Auditoria</h1>
          </AuditHeader>

          <HeaderActions>
            <span style={{ color: "var(--color-text-muted)" }}>
              {logs.length > 0 ? `${logs.length} eventos carregados` : "Sem eventos carregados"}
            </span>
            <RefreshButton type="button" onClick={() => void loadLogs(false)} disabled={isRefreshing || isLoading}>
              <FaSyncAlt size={12} />
              Atualizar
            </RefreshButton>
          </HeaderActions>

          {isLoading ? (
            <LoadingScreen />
          ) : error ? (
            <EmptyState>{error}</EmptyState>
          ) : logs.length === 0 ? (
            <EmptyState>Nenhum evento de auditoria encontrado.</EmptyState>
          ) : (
            <AuditList>
              {logs.map((log, index) => (
                <AuditCard
                  key={log.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.25 }}
                >
                  <div className="who">{log.who}</div>
                  <div className="what">{log.what}</div>
                  <div className="meta">
                    <span className="chip">{formatDateTime(log.date, log.time)}</span>
                  </div>
                </AuditCard>
              ))}
            </AuditList>
          )}
        </AuditContainer>
      </AuditPageShell>
    </PageWrapper>
  );
};

export default AuditPage;
