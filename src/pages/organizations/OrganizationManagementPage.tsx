import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../../context/hooks/useAuthContext";
import useOrganizationContext from "../../context/hooks/useOrganizationContext";
import { roleOptions } from "../../types/UserRole";
import { Card, Page, ErrorMessage, PrimaryButton, SecondaryButton, InvitationItem, CardActions } from "./organizationPagesStyle";

type Invitation = { id: string; email: string; status: string; managementRole: string; expiresAt: string };

export default function OrganizationManagementPage() {
  const { token } = useAuthContext();
  const navigate = useNavigate();
  const { activeOrganization } = useOrganizationContext();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [email, setEmail] = useState("");
  const [managementRole, setManagementRole] = useState("member");
  const [musicalRoles, setMusicalRoles] = useState<string[]>([]);
  const [validityDays, setValidityDays] = useState(7);
  const [invitationLink, setInvitationLink] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const endpoint = `${import.meta.env.VITE_API_URL_PRODUTION}/organizations/${activeOrganization?.id}/invitations`;
  const isLeader = activeOrganization?.membership?.managementRole === "leader";
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const load = useCallback(async () => {
    const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erro ao carregar convites");
    setInvitations(data);
  }, [endpoint, token]);
  useEffect(() => { void load().catch(err => setError(err.message)); }, [load]);

  const create = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError(""); setInvitationLink("");
    try {
      const res = await fetch(endpoint, { method: "POST", headers, body: JSON.stringify({
        email, managementRole: isLeader ? "member" : managementRole, musicalRoles,
        expiresAt: new Date(Date.now() + validityDays * 86400000).toISOString(),
      }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao criar convite");
      setInvitationLink(`${window.location.origin}${data.invitationPath}`);
      setEmail(""); await load();
    } catch (err) { setError(err instanceof Error ? err.message : "Erro ao criar convite"); }
    finally { setBusy(false); }
  };

  const revoke = async (id: string) => {
    setBusy(true); setError("");
    try {
      const res = await fetch(`${endpoint}/${id}`, { method: "DELETE", headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erro ao cancelar convite");
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : "Erro ao cancelar convite"); }
    finally { setBusy(false); }
  };

  return <Page><Card>
    <h1>Convites</h1><p>{activeOrganization?.name}</p>
    <form onSubmit={event => void create(event)}>
      <label>E-mail da pessoa<input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
      <label>Permissão<select value={managementRole} disabled={isLeader} onChange={e => setManagementRole(e.target.value)}>
        <option value="member">Membro</option><option value="leader">Líder</option><option value="organization_admin">Administrador da organização</option>
      </select></label>
      <label>Validade<select value={validityDays} onChange={e => setValidityDays(Number(e.target.value))}>
        <option value={1}>1 dia</option><option value={7}>7 dias</option><option value={14}>14 dias</option>
      </select></label>
      <fieldset><legend>Funções musicais</legend>{roleOptions.filter(role => !["admin", "leader", "guest"].includes(role.value)).map(role => <label key={role.value}>
        <input type="checkbox" checked={musicalRoles.includes(role.value)} onChange={e => setMusicalRoles(current => e.target.checked ? [...current, role.value] : current.filter(value => value !== role.value))} /> {role.label}
      </label>)}</fieldset>
      <PrimaryButton disabled={busy} type="submit">{busy ? "Aguarde..." : "Criar convite"}</PrimaryButton>
    </form>
    {invitationLink && <section><p>Compartilhe este link apenas com a pessoa convidada. Ele só aparece agora.</p><input aria-label="Link do convite" readOnly value={invitationLink} onFocus={e => e.target.select()} /><SecondaryButton onClick={() => void navigator.clipboard.writeText(invitationLink).catch(() => setError("Selecione e copie o link."))}>Copiar link</SecondaryButton></section>}
    {error && <ErrorMessage>{error}</ErrorMessage>}
    <h2>Convites criados</h2>
    {!invitations.length && <p>Nenhum convite criado.</p>}
    {invitations.map(invitation => <InvitationItem key={invitation.id}>
      <strong>{invitation.email}</strong><p>{({ pending: "Pendente", accepted: "Aceito", revoked: "Cancelado", expired: "Expirado" } as Record<string, string>)[invitation.status] || invitation.status} · válido até {new Date(invitation.expiresAt).toLocaleDateString("pt-BR")}</p>
      {invitation.status === "pending" && (!isLeader || invitation.managementRole === "member") && <SecondaryButton disabled={busy} onClick={() => void revoke(invitation.id)}>Cancelar convite</SecondaryButton>}
    </InvitationItem>)}
    <CardActions><SecondaryButton type="button" onClick={() => navigate("/profile")}>Voltar ao perfil</SecondaryButton><SecondaryButton type="button" onClick={() => navigate("/organizations")}>Trocar organização</SecondaryButton></CardActions>
  </Card></Page>;
}
