import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useOrganizationContext from "../../context/hooks/useOrganizationContext";
import useAuthContext from "../../context/hooks/useAuthContext";
import LoadingScreen from "../../components/loading/LoadingScreen";
import {
  Card,
  ErrorMessage,
  OrganizationButton,
  OrganizationInfo,
  OrganizationList,
  OrganizationLogo,
  Page,
  SecondaryButton,
  PrimaryButton,
} from "./organizationPagesStyle";

const OrganizationSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout, token } = useAuthContext();
  const [name, setName] = useState("");
  const [type, setType] = useState("igreja");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const {
    organizations,
    activeOrganization,
    activeOrganizationId,
    isOrganizationReady,
    isLoadingOrganizations,
    organizationsError,
    refreshOrganizations,
    selectOrganization,
  } = useOrganizationContext();

  if (!isOrganizationReady || isLoadingOrganizations) {
    return <LoadingScreen />;
  }

  const handleSelect = (organizationId: string) => {
    selectOrganization(organizationId);
    navigate("/", { replace: true });
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault(); setCreating(true); setCreateError("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL_PRODUTION}/organizations`, {
        method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ name, type, timezone: "America/Sao_Paulo" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao criar organização");
      await refreshOrganizations(); selectOrganization(data.organization.id); navigate("/", { replace: true });
    } catch (error) { setCreateError(error instanceof Error ? error.message : "Erro ao criar organização"); }
    finally { setCreating(false); }
  };

  return (
    <Page>
      <Card>
        {activeOrganization && (
          <SecondaryButton
            type="button"
            onClick={() => navigate("/", { replace: true })}
            style={{ marginTop: 0, marginBottom: 16 }}
          >
            ← Voltar para {activeOrganization.name}
          </SecondaryButton>
        )}
        <h1>Escolha uma organização</h1>
        <p>Cada organização tem suas próprias músicas, escalas e pessoas.</p>

        {organizationsError && (
          <>
            <ErrorMessage>{organizationsError}</ErrorMessage>
            <SecondaryButton type="button" onClick={() => void refreshOrganizations()}>
              Tentar novamente
            </SecondaryButton>
          </>
        )}

        {!organizationsError && organizations.length === 0 && (
          <p>Você ainda não participa de uma organização. Abra o link de convite que recebeu.</p>
        )}

        <OrganizationList>
          {organizations.map((organization) => {
            const logo = organization.logoURL || organization.logo;
            return (
              <OrganizationButton
                key={organization.id}
                type="button"
                $active={organization.id === activeOrganizationId}
                onClick={() => handleSelect(organization.id)}
              >
                <OrganizationLogo>
                  {logo ? (
                    <img src={logo} alt="" />
                  ) : (
                    organization.name.slice(0, 1).toUpperCase()
                  )}
                </OrganizationLogo>
                <OrganizationInfo>
                  <strong>{organization.name}</strong>
                  <small>{organization.type || "organização"}</small>
                </OrganizationInfo>
              </OrganizationButton>
            );
          })}
        </OrganizationList>

        <h2 style={{ marginTop: 28 }}>Criar organização</h2>
        <form onSubmit={event => void handleCreate(event)}>
          <label>Nome<input required maxLength={120} value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", padding: 10 }} /></label>
          <label>Tipo<select value={type} onChange={e => setType(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 10 }}><option value="igreja">Igreja</option><option value="banda">Banda</option><option value="grupo">Grupo</option></select></label>
          {createError && <ErrorMessage>{createError}</ErrorMessage>}
          <PrimaryButton type="submit" disabled={creating}>{creating ? "Criando..." : "Criar organização"}</PrimaryButton>
        </form>

        <SecondaryButton
          type="button"
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
        >
          Sair da conta
        </SecondaryButton>
      </Card>
    </Page>
  );
};

export default OrganizationSelectionPage;
