import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../../context/hooks/useAuthContext";
import useOrganizationContext from "../../context/hooks/useOrganizationContext";
import { Card, Page, ErrorMessage, PrimaryButton, SecondaryButton, InvitationItem, CardActions } from "./organizationPagesStyle";
import useScheduleRolesContext from "../../context/hooks/useScheduleRolesContext";
import { toast } from "sonner";
import {
  CloseButton,
  DangerActionButton,
  FieldLabel,
  FooterButton,
  FormGroup,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SelectField,
} from "../users/usersStyle";

type Invitation = { id: string; email: string; status: string; managementRole: string; expiresAt: string };
type OrganizationMember = { id: string; nickname?: string; name?: string; email?: string; status?: string; managementRole?: string };
type OwnershipTransfer = { id: string; requesterId: string; targetUserId: string; status: "pending" | "accepted" | "rejected"; createdAt: string };
const API_URL = import.meta.env.VITE_API_URL_PRODUTION;

export default function OrganizationManagementPage() {
  const { token, user } = useAuthContext();
  const navigate = useNavigate();
  const { activeOrganization, refreshOrganizations } = useOrganizationContext();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [email, setEmail] = useState("");
  const [managementRole, setManagementRole] = useState("member");
  const [validityDays, setValidityDays] = useState(7);
  const [invitationLink, setInvitationLink] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [isOwnerActionOpen, setIsOwnerActionOpen] = useState(false);
  const [ownerActionMode, setOwnerActionMode] = useState<"transfer" | "manage">("manage");
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [newOwnerId, setNewOwnerId] = useState("");
  const [ownershipTransfers, setOwnershipTransfers] = useState<OwnershipTransfer[]>([]);
  const { roles, createRole, setRoleActive } = useScheduleRolesContext();
  const endpoint = `${import.meta.env.VITE_API_URL_PRODUTION}/organizations/${activeOrganization?.id}/invitations`;
  const isLeader = activeOrganization?.membership?.managementRole === "leader";
  const isOwner = activeOrganization?.membership?.managementRole === "owner";
  const canManageOrganization = isOwner || isLeader || activeOrganization?.membership?.managementRole === "organization_admin";
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const load = useCallback(async () => {
    const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Erro ao carregar convites");
    setInvitations(data);
  }, [endpoint, token]);
  useEffect(() => {
    if (canManageOrganization) void load().catch(err => setError(err.message));
    else setInvitations([]);
  }, [load, canManageOrganization]);

  const loadOwnershipTransfers = useCallback(async () => {
    if (!activeOrganization || !token) return;
    const response = await fetch(`${API_URL}/organizations/${activeOrganization.id}/ownership-transfers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Não foi possível carregar os pedidos de propriedade.");
    setOwnershipTransfers(Array.isArray(data) ? data : []);
  }, [activeOrganization, token]);
  useEffect(() => { void loadOwnershipTransfers().catch(err => setError(err.message)); }, [loadOwnershipTransfers]);

  const create = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError(""); setInvitationLink("");
    try {
      const res = await fetch(endpoint, { method: "POST", headers, body: JSON.stringify({
        email, managementRole: isLeader ? "member" : managementRole, musicalRoles: [],
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

  const addRole = async () => {
    if (!newRoleName.trim()) return;
    setBusy(true); setError("");
    try { await createRole(newRoleName); setNewRoleName(""); }
    catch (err) { setError(err instanceof Error ? err.message : "Erro ao criar função"); }
    finally { setBusy(false); }
  };

  const openOwnerActions = async (mode: "transfer" | "manage") => {
    if (!activeOrganization || !token) return;
    setError("");
    setBusy(true);
    const toastId = toast.loading("Carregando membros da organização...");
    try {
      const response = await fetch(`${API_URL}/organizations/${activeOrganization.id}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Não foi possível carregar os membros.");
      const candidates = (Array.isArray(data) ? data : []).filter((member: OrganizationMember) =>
        member.id !== user?.id && member.status === "enabled"
      );
      setMembers(candidates);
      setNewOwnerId(candidates[0]?.id || "");
      setOwnerActionMode(mode);
      setIsOwnerActionOpen(true);
      toast.dismiss(toastId);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Não foi possível carregar os membros.";
      setError(message);
      toast.error(message, { id: toastId });
    } finally {
      setBusy(false);
    }
  };

  const requestOwnershipTransfer = async () => {
    if (!activeOrganization || !newOwnerId) return;
    setBusy(true);
    setError("");
    const toastId = toast.loading("Enviando pedido de troca de proprietário...");
    try {
      const response = await fetch(`${API_URL}/organizations/${activeOrganization.id}/transfer-ownership`, {
        method: "POST", headers, body: JSON.stringify({ newOwnerId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Não foi possível transferir a propriedade.");
      toast.success("Pedido enviado. A propriedade só muda quando a outra pessoa aceitar.", { id: toastId });
      setIsOwnerActionOpen(false);
      await Promise.all([refreshOrganizations(), loadOwnershipTransfers()]).catch(console.error);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Não foi possível transferir a propriedade.";
      setError(message);
      toast.error(message, { id: toastId });
    } finally {
      setBusy(false);
    }
  };

  const respondToOwnershipTransfer = async (transferId: string, decision: "accept" | "reject") => {
    if (!activeOrganization) return;
    setBusy(true);
    setError("");
    const toastId = toast.loading(decision === "accept" ? "Enviando aceite..." : "Enviando recusa...");
    try {
      const response = await fetch(`${API_URL}/organizations/${activeOrganization.id}/ownership-transfers/${transferId}/respond`, {
        method: "POST", headers, body: JSON.stringify({ decision }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Não foi possível responder ao pedido.");
      toast.success(decision === "accept" ? "Agora você é o proprietário da organização." : "Pedido recusado.", { id: toastId });
      await Promise.all([refreshOrganizations(), loadOwnershipTransfers()]).catch(console.error);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Não foi possível responder ao pedido.";
      setError(message);
      toast.error(message, { id: toastId });
    } finally {
      setBusy(false);
    }
  };

  const deleteOrganization = async () => {
    if (!activeOrganization) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/organizations/${activeOrganization.id}`, {
        method: "DELETE", headers,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Não foi possível excluir a organização.");
      await refreshOrganizations();
      toast.success("Organização e seus dados foram excluídos.");
      setIsOwnerActionOpen(false);
      navigate("/organizations", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível excluir a organização.");
    } finally {
      setBusy(false);
    }
  };

  return <Page><Card>
    <h1>{canManageOrganization ? "Gerenciar organização" : "Pedidos de propriedade"}</h1>
    <p>{activeOrganization?.name} · {isOwner ? "Você é o proprietário" : "Você é membro desta organização"}</p>
    <div className="organization-management-grid">
    {canManageOrganization && <>
    <section className="organization-panel">
    <h2>Convidar pessoas</h2>
    <form onSubmit={event => void create(event)}>
      <label>E-mail da pessoa<input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
      <label>Permissão<select value={managementRole} disabled={isLeader} onChange={e => setManagementRole(e.target.value)}>
        <option value="member">Membro</option><option value="leader">Líder</option><option value="organization_admin">Administrador da organização</option>
      </select></label>
      <label>Validade<select value={validityDays} onChange={e => setValidityDays(Number(e.target.value))}>
        <option value={1}>1 dia</option><option value={7}>7 dias</option><option value={14}>14 dias</option>
      </select></label>
      <p>A pessoa entrará sem função. Depois da entrada, atribua as funções na tela de usuários.</p>
      <PrimaryButton disabled={busy} type="submit">{busy ? "Aguarde..." : "Criar convite"}</PrimaryButton>
    </form>
    {invitationLink && <div className="organization-invitation-link"><p>Compartilhe este link apenas com a pessoa convidada. Ele só aparece agora.</p><input aria-label="Link do convite" readOnly value={invitationLink} onFocus={e => e.target.select()} /><SecondaryButton onClick={() => void navigator.clipboard.writeText(invitationLink).catch(() => setError("Selecione e copie o link."))}>Copiar link</SecondaryButton></div>}
    {error && <ErrorMessage>{error}</ErrorMessage>}
    </section>
    {isOwner && <section className="organization-panel">
      <h2>Propriedade da organização</h2>
      <p>Passe a propriedade para outro membro sem excluir sua conta, ou exclua a organização.</p>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <SecondaryButton type="button" disabled={busy} onClick={() => void openOwnerActions("transfer")}>Passar propriedade</SecondaryButton>
        <SecondaryButton type="button" disabled={busy} onClick={() => void openOwnerActions("manage")}>Excluir organização</SecondaryButton>
      </div>
    </section>}
    <section className="organization-panel">
    <h2>Funções da escala</h2>
    <p>Crie funções para os membros e desative as que não serão usadas em novas escalas.</p>
    <div className="organization-role-form">
      <input value={newRoleName} maxLength={60} placeholder="Ex.: Saxofone" onChange={event => setNewRoleName(event.target.value)} />
      <PrimaryButton type="button" disabled={busy || !newRoleName.trim()} onClick={() => void addRole()}>Adicionar função</PrimaryButton>
    </div>
    {roles.map(role => <InvitationItem key={role.id}>
      <strong>{role.name}</strong><p>{role.active ? "Ativa nas novas escalas" : "Desativada"}</p>
      <SecondaryButton type="button" disabled={busy} onClick={() => void setRoleActive(role.id, !role.active).catch(err => setError(err instanceof Error ? err.message : "Erro ao alterar função"))}>
        {role.active ? "Desativar" : "Reativar"}
      </SecondaryButton>
    </InvitationItem>)}
    </section>
    <section className="organization-panel">
    <h2>Convites criados</h2>
    {!invitations.length && <p>Nenhum convite criado.</p>}
    {invitations.map(invitation => <InvitationItem key={invitation.id}>
      <strong>{invitation.email}</strong><p>{({ pending: "Pendente", accepted: "Aceito", revoked: "Cancelado", expired: "Expirado" } as Record<string, string>)[invitation.status] || invitation.status} · válido até {new Date(invitation.expiresAt).toLocaleDateString("pt-BR")}</p>
      {invitation.status === "pending" && (!isLeader || invitation.managementRole === "member") && <SecondaryButton disabled={busy} onClick={() => void revoke(invitation.id)}>Cancelar convite</SecondaryButton>}
    </InvitationItem>)}
    </section>
    </>}
    {ownershipTransfers.length > 0 ? <section className="organization-panel organization-transfer-panel">
      <h2>Pedidos para passar a propriedade</h2>
      {ownershipTransfers.slice(0, 5).map(transfer => {
        const incoming = transfer.targetUserId === user?.id;
        return <InvitationItem key={transfer.id}>
          <strong>{incoming ? "Pedido recebido" : "Pedido enviado"}</strong>
          <p>{transfer.status === "pending"
            ? incoming ? "O proprietário quer passar a organização para você." : "Aguardando a resposta da pessoa escolhida."
            : transfer.status === "accepted" ? incoming ? "Você aceitou e agora é o proprietário." : "A pessoa aceitou. Você continua na organização como membro."
              : incoming ? "Você recusou o pedido." : "A pessoa recusou o pedido. Você continua como proprietário."}</p>
          {incoming && transfer.status === "pending" && <CardActions>
            <SecondaryButton type="button" disabled={busy} onClick={() => void respondToOwnershipTransfer(transfer.id, "accept")}>Aceitar e me tornar proprietário</SecondaryButton>
            <FooterButton type="button" disabled={busy} onClick={() => void respondToOwnershipTransfer(transfer.id, "reject")}>Recusar</FooterButton>
          </CardActions>}
        </InvitationItem>;
      })}
    </section> : !canManageOrganization && <section className="organization-panel organization-transfer-panel">
      <h2>Pedidos para passar a propriedade</h2>
      <p>Não há pedidos aguardando sua resposta nesta organização.</p>
    </section>}
    </div>
    <CardActions><SecondaryButton type="button" onClick={() => navigate("/profile")}>Voltar ao perfil</SecondaryButton><SecondaryButton type="button" onClick={() => navigate("/organizations")}>Trocar organização</SecondaryButton></CardActions>
  </Card>
  {isOwnerActionOpen && <ModalOverlay onClick={() => !busy && setIsOwnerActionOpen(false)}>
    <ModalContent onClick={event => event.stopPropagation()}>
      <ModalHeader>
        <div>
          <h2>{ownerActionMode === "transfer" ? `Passar propriedade de ${activeOrganization?.name}` : `Excluir ${activeOrganization?.name}?`}</h2>
          <p>{ownerActionMode === "transfer"
            ? "Escolha um membro ativo para convidar a assumir a propriedade. Você continuará como proprietário até a pessoa aceitar."
            : "Você pode passar a propriedade para outro membro e manter a organização, ou excluí-la sem apagar sua conta."}</p>
        </div>
        <CloseButton type="button" disabled={busy} onClick={() => setIsOwnerActionOpen(false)} aria-label="Fechar">×</CloseButton>
      </ModalHeader>
      {members.length > 0 ? <FormGroup>
        <FieldLabel htmlFor="organization-new-owner">Novo proprietário</FieldLabel>
        <SelectField id="organization-new-owner" value={newOwnerId} onChange={event => setNewOwnerId(event.target.value)}>
          {members.map(member => <option key={member.id} value={member.id}>{member.nickname || member.name || member.email || "Membro"}</option>)}
        </SelectField>
        <SecondaryButton type="button" disabled={busy || !newOwnerId} onClick={() => void requestOwnershipTransfer()}>
          {busy ? "Aguarde..." : "Enviar pedido de troca de proprietário"}
        </SecondaryButton>
      </FormGroup> : <p>Não há outro membro ativo para receber a propriedade.</p>}
      {ownerActionMode === "manage" && <p>Excluir a organização apaga membros, convites, escalas, músicas e os demais dados dela.</p>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <CardActions>
        <FooterButton type="button" disabled={busy} onClick={() => setIsOwnerActionOpen(false)}>Cancelar</FooterButton>
        {ownerActionMode === "manage" && <DangerActionButton type="button" disabled={busy} onClick={() => void deleteOrganization()}>
          {busy ? "Excluindo..." : "Excluir organização"}
        </DangerActionButton>}
      </CardActions>
    </ModalContent>
  </ModalOverlay>}
  </Page>;
}
