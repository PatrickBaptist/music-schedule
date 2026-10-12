import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import LoadingScreen from "../../components/loading/LoadingScreen";
import useAuthContext from "../../context/hooks/useAuthContext";
import useOrganizationContext from "../../context/hooks/useOrganizationContext";
import {
  Card,
  ErrorMessage,
  InvitationDetails,
  Page,
  PrimaryButton,
  SecondaryButton,
} from "./organizationPagesStyle";

interface InvitationPreview {
  organization?: {
    id?: string;
    name?: string;
    slug?: string;
    type?: string;
    logo?: string;
    logoURL?: string;
  };
  organizationId?: string;
  organizationName?: string;
  organizationType?: string;
  email?: string;
  expiresAt?: string;
  status?: string;
}

const getErrorMessage = (data: unknown, fallback: string) => {
  if (data && typeof data === "object" && "message" in data) {
    return String((data as { message?: unknown }).message);
  }
  return fallback;
};

const InvitationPage: React.FC = () => {
  const { organizationSlug = "", token: invitationToken = "" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { token, isAuthenticated, isAuthReady } = useAuthContext();
  const { refreshOrganizations, selectOrganization } = useOrganizationContext();
  const [preview, setPreview] = useState<InvitationPreview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL_PRODUTION;

  useEffect(() => {
    let cancelled = false;

    const loadPreview = async () => {
      if (!organizationSlug || !invitationToken) {
        setError("Este convite está incompleto.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/invitations/${encodeURIComponent(organizationSlug)}/${encodeURIComponent(invitationToken)}/preview`
        );
        const data: unknown = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(getErrorMessage(data, "Este convite não é válido ou já venceu."));
        }

        if (!cancelled) setPreview(data as InvitationPreview);
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Não foi possível abrir este convite."
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadPreview();
    return () => {
      cancelled = true;
    };
  }, [API_URL, invitationToken, organizationSlug]);

  const handleAccept = async () => {
    if (!token) return;

    setIsAccepting(true);
    setError(null);
    const toastId = toast.loading("Aceitando convite...");

    try {
      const response = await fetch(
        `${API_URL}/invitations/${encodeURIComponent(organizationSlug)}/${encodeURIComponent(invitationToken)}/accept`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data: unknown = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(getErrorMessage(data, "Não foi possível aceitar este convite."));
      }

      const organizations = await refreshOrganizations();
      const result = data as {
        organizationId?: string;
        organization?: { id?: string; slug?: string };
      };
      const acceptedOrganizationId = result.organizationId
        || result.organization?.id
        || organizations.find(({ slug }) => slug === organizationSlug)?.id;

      if (acceptedOrganizationId) selectOrganization(acceptedOrganizationId);

      toast.success("Convite aceito. Você já pode usar a organização.", { id: toastId });
      navigate("/", { replace: true });
    } catch (requestError) {
      const message = requestError instanceof Error
        ? requestError.message
        : "Não foi possível aceitar este convite.";
      setError(message);
      toast.error(message, { id: toastId });
    } finally {
      setIsAccepting(false);
    }
  };

  if (isLoading || !isAuthReady) return <LoadingScreen />;

  const organizationName = preview?.organization?.name
    || preview?.organizationName
    || organizationSlug;
  const organizationType = preview?.organization?.type
    || preview?.organizationType
    || "organização";

  return (
    <Page>
      <Card>
        <h1>Convite para participar</h1>

        {error && !preview ? (
          <>
            <ErrorMessage>{error}</ErrorMessage>
            <SecondaryButton type="button" onClick={() => navigate("/login")}>
              Ir para o login
            </SecondaryButton>
          </>
        ) : (
          <>
            <p>Você foi convidado para entrar nesta organização:</p>
            <InvitationDetails>
              <strong>{organizationName}</strong>
              <span>{organizationType}</span>
            </InvitationDetails>

            {preview?.email && <p>O convite foi enviado para {preview.email}.</p>}
            {error && <ErrorMessage>{error}</ErrorMessage>}

            {isAuthenticated ? (
              <PrimaryButton type="button" disabled={isAccepting} onClick={() => void handleAccept()}>
                {isAccepting ? "Aceitando..." : "Aceitar convite"}
              </PrimaryButton>
            ) : (
              <>
                <PrimaryButton
                  type="button"
                  onClick={() => navigate("/login", { state: { from: location.pathname } })}
                >
                  Entrar para aceitar
                </PrimaryButton>
                <SecondaryButton
                  type="button"
                  onClick={() => navigate("/register", { state: { from: location.pathname } })}
                >
                  Criar uma conta
                </SecondaryButton>
              </>
            )}
          </>
        )}
      </Card>
    </Page>
  );
};

export default InvitationPage;
