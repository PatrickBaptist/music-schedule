import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuthContext from "../../context/hooks/useAuthContext";
import useOrganizationContext from "../../context/hooks/useOrganizationContext";
import { roleOptions } from "../../types/UserRole";
import { Card, Page, ErrorMessage, PrimaryButton, SecondaryButton } from "./organizationPagesStyle";

type Invitation = { id: string; email: string; status: string; managementRole: string; expiresAt: string };

export default function OrganizationManagementPage() {
  const { token } = useAuthContext();
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
    <form onSubmit={event => void create(event)} style={{ display: "grid", gap: 12 }}>
      <label>E-mail da pessoa<input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: 10 }} /></label>
      <label>Permissão<select value={managementRole} disabled={isLeader} onChange={e => setManagementRole(e.target.value)} style={{ width: "100%", padding: 10 }}>
        <option value="member">Membro</option><option value="leader">Líder</option><option value="organization_admin">Administrador da organização</option>
      </select></label>
      <label>Validade<select value={validityDays} onChange={e => setValidityDays(Number(e.target.value))} style={{ width: "100%", padding: 10 }}>
        <option value={1}>1 dia</option><option value={7}>7 dias</option><option value={14}>14 dias</option>
      </select></label>
      <fieldset><legend>Funções musicais</legend>{roleOptions.filter(role => !["admin", "leader", "guest"].includes(role.value)).map(role => <label key={role.value} style={{ display: "block", padding: 4 }}>
        <input type="checkbox" checked={musicalRoles.includes(role.value)} onChange={e => setMusicalRoles(current => e.target.checked ? [...current, role.value] : current.filter(value => value !== role.value))} /> {role.label}
      </label>)}</fieldset>
      <PrimaryButton disabled={busy} type="submit">{busy ? "Aguarde..." : "Criar convite"}</PrimaryButton>
    </form>
    {invitationLink && <section><p>Compartilhe este link apenas com a pessoa convidada. Ele só aparece agora.</p><input aria-label="Link do convite" readOnly value={invitationLink} onFocus={e => e.target.select()} style={{ width: "100%", padding: 10 }} /><SecondaryButton onClick={() => void navigator.clipboard.writeText(invitationLink).catch(() => setError("Selecione e copie o link."))}>Copiar link</SecondaryButton></section>}
    {error && <ErrorMessage>{error}</ErrorMessage>}
    <h2>Convites criados</h2>
    {!invitations.length && <p>Nenhum convite criado.</p>}
    {invitations.map(invitation => <div key={invitation.id} style={{ borderBottom: "1px solid var(--color-border)", padding: "12px 0" }}>
      <strong>{invitation.email}</strong><p>{({ pending: "Pendente", accepted: "Aceito", revoked: "Cancelado", expired: "Expirado" } as Record<string, string>)[invitation.status] || invitation.status} · válido até {new Date(invitation.expiresAt).toLocaleDateString("pt-BR")}</p>
      {invitation.status === "pending" && (!isLeader || invitation.managementRole === "member") && <SecondaryButton disabled={busy} onClick={() => void revoke(invitation.id)}>Cancelar convite</SecondaryButton>}
    </div>)}
    <p><Link to="/organizations">Escolher organização</Link></p>
  </Card></Page>;
}
