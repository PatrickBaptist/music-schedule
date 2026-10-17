import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  ErrorMessage,
  Page,
  PrimaryButton,
  SecondaryButton,
} from "./organizationPagesStyle";

type TransferPreview = { organizationName: string; expiresAt: string };
type Decision = "accept" | "reject";
const API_URL = import.meta.env.VITE_API_URL_PRODUTION;

export default function OwnershipTransferPage() {
  const [searchParams] = useSearchParams();
  const transferToken = searchParams.get("token") || "";
  const [preview, setPreview] = useState<TransferPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Decision | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!transferToken) {
        setError("O link de confirmação está incompleto.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/ownership-transfers/${encodeURIComponent(transferToken)}/preview`);
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Este pedido não é válido ou já venceu.");
        if (!cancelled) setPreview(data as TransferPreview);
      } catch (reason) {
        if (!cancelled) setError(reason instanceof Error ? reason.message : "Não foi possível abrir o pedido.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [transferToken]);

  const respond = async (decision: Decision) => {
    setBusy(true);
    setError("");
    const toastId = toast.loading(decision === "accept" ? "Enviando aceite..." : "Enviando recusa...");
    try {
      const response = await fetch(`${API_URL}/ownership-transfers/${encodeURIComponent(transferToken)}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Não foi possível responder ao pedido.");
      setResult(decision);
      toast.success(decision === "accept" ? "Agora você é o proprietário da organização." : "Pedido recusado.", { id: toastId });
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : "Não foi possível responder ao pedido.";
      setError(message);
      toast.error(message, { id: toastId });
    } finally {
      setBusy(false);
    }
  };

  return <Page><Card>
    <h1>Troca de proprietário</h1>
    {loading ? <p>Carregando o pedido...</p> : preview ? <>
      <p>O proprietário atual quer passar esta organização para você:</p>
      <h2>{preview.organizationName}</h2>
      {result ? <p role="status">{result === "accept"
        ? "Pedido aceito. Agora você é o proprietário da organização."
        : "Pedido recusado. O proprietário atual continuará responsável pela organização."}</p> : <>
        <p>Ao aceitar, você se tornará o proprietário. A mudança só acontece quando confirmar abaixo.</p>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <PrimaryButton type="button" disabled={busy} onClick={() => void respond("accept")}>
          {busy ? "Enviando resposta..." : "Aceitar e me tornar proprietário"}
        </PrimaryButton>
        <SecondaryButton type="button" disabled={busy} onClick={() => void respond("reject")}>Recusar pedido</SecondaryButton>
      </>}
    </> : <ErrorMessage>{error || "Este pedido não está disponível."}</ErrorMessage>}
  </Card></Page>;
}
