import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CloseButton,
  DangerActionButton,
  FieldLabel,
  FooterButton,
  FormGroup,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SelectField,
  TextInput,
} from "../users/usersStyle";

type OwnedOrganization = {
  id: string;
  name: string;
  otherMembersCount: number;
};
type OrganizationChoice = { action: "delete" | "" };

interface DeleteAccountDialogProps {
  email: string;
  token: string;
  onClose: () => void;
  onDeleted: () => void;
}

const API_URL = import.meta.env.VITE_API_URL_PRODUTION;

export default function DeleteAccountDialog({ email, token, onClose, onDeleted }: DeleteAccountDialogProps) {
  const [organizations, setOrganizations] = useState<OwnedOrganization[]>([]);
  const [choices, setChoices] = useState<Record<string, OrganizationChoice>>({});
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void fetch(`${API_URL}/auth/account/deletion-options`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async response => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Não foi possível carregar suas organizações.");
        if (!active) return;
        const owned = Array.isArray(data.organizations) ? data.organizations as OwnedOrganization[] : [];
        setOrganizations(owned);
        setChoices(Object.fromEntries(owned.filter(org => org.otherMembersCount > 0).map(org => [org.id, { action: "" }])));
      })
      .catch(reason => { if (active) setError(reason instanceof Error ? reason.message : "Erro ao carregar organizações."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (confirmationEmail.trim().toLowerCase() !== email.trim().toLowerCase()) {
      setError("Digite o e-mail da sua conta para confirmar.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/auth/account`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ confirmationEmail, organizations: choices }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Não foi possível excluir sua conta.");
      toast.success("Sua conta foi excluída.");
      onDeleted();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível excluir sua conta.");
    } finally {
      setBusy(false);
    }
  };

  const updateChoice = (organization: OwnedOrganization, action: OrganizationChoice["action"]) => {
    setChoices(current => ({
      ...current,
      [organization.id]: { action },
    }));
  };

  const choicesAreReady = organizations.every(organization => {
    if (organization.otherMembersCount === 0) return true;
    const choice = choices[organization.id];
    return Boolean(choice?.action);
  });

  return (
    <ModalOverlay onClick={() => !busy && onClose()}>
      <ModalContent onClick={event => event.stopPropagation()}>
        <ModalHeader>
          <div>
            <h2>Excluir minha conta</h2>
            <p>Esta ação é permanente. As organizações que você administra precisam ser resolvidas antes.</p>
          </div>
          <CloseButton type="button" onClick={onClose} disabled={busy} aria-label="Fechar">×</CloseButton>
        </ModalHeader>

        {loading ? <p>Carregando suas organizações...</p> : (
          <ModalBody onSubmit={event => void submit(event)}>
            {organizations.map(organization => {
              const choice = choices[organization.id];
              return (
                <section key={organization.id} style={{ display: "grid", gap: 10, padding: 12, border: "1px solid #ddd", borderRadius: 12 }}>
                  <strong>{organization.name}</strong>
                  {organization.otherMembersCount === 0 ? (
                    <p>Você é o único membro. Esta organização será apagada junto com sua conta.</p>
                  ) : (
                    <>
                      <p>Para manter esta organização, primeiro peça a troca de proprietário no gerenciamento e aguarde a outra pessoa aceitar. Depois, volte para excluir sua conta.</p>
                      <FormGroup>
                        <FieldLabel htmlFor={`organization-choice-${organization.id}`}>O que fazer com esta organização?</FieldLabel>
                        <SelectField
                          id={`organization-choice-${organization.id}`}
                          value={choice?.action || ""}
                          onChange={event => updateChoice(organization, event.target.value as OrganizationChoice["action"])}
                        >
                          <option value="" disabled>Selecione uma ação</option>
                          <option value="delete">Apagar esta organização</option>
                        </SelectField>
                      </FormGroup>
                      <p>Serão apagados os membros, convites, escalas, músicas e demais dados desta organização.</p>
                    </>
                  )}
                </section>
              );
            })}
            {organizations.length === 0 && <p>Você não é proprietário de nenhuma organização. Sua participação nas demais será removida.</p>}
            <p>Você também será removido das outras organizações em que participa.</p>
            <FormGroup>
              <FieldLabel htmlFor="delete-account-email">Digite seu e-mail para confirmar: {email}</FieldLabel>
              <TextInput id="delete-account-email" type="email" required value={confirmationEmail} onChange={event => setConfirmationEmail(event.target.value)} />
            </FormGroup>
            {error && <p role="alert">{error}</p>}
            <ModalFooter>
              <FooterButton type="button" onClick={onClose} disabled={busy}>Cancelar</FooterButton>
              <DangerActionButton type="submit" disabled={busy || !choicesAreReady || confirmationEmail.trim().toLowerCase() !== email.trim().toLowerCase()}>
                {busy ? "Excluindo..." : "Excluir conta permanentemente"}
              </DangerActionButton>
            </ModalFooter>
          </ModalBody>
        )}
        {!loading && error && !organizations.length && <p role="alert">{error}</p>}
      </ModalContent>
    </ModalOverlay>
  );
}
