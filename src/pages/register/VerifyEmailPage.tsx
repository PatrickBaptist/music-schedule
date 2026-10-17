import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PageWrapper from "../../components/pageWrapper/pageWrapper";
import { Button, ContainerRegiter, SuccessDialog, Title } from "./registerStyle";
import useAuthContext from "../../context/hooks/useAuthContext";

const VerifyEmailPage = () => {
  const [params] = useSearchParams();
  const { verifyEmail } = useAuthContext();
  const [message, setMessage] = useState("Confirmando seu e-mail...");
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setMessage("O link de confirmação está incompleto. Abra o link enviado por e-mail.");
      setError(true);
      return;
    }

    let active = true;
    void verifyEmail(token)
      .then((result) => { if (active) setMessage(result); })
      .catch((reason: unknown) => {
        if (!active) return;
        setMessage(reason instanceof Error ? reason.message : "Não foi possível confirmar seu e-mail.");
        setError(true);
      });
    return () => { active = false; };
  }, [params, verifyEmail]);

  return (
    <PageWrapper>
      <ContainerRegiter>
        <SuccessDialog style={{ display: "flex" }}>
          <Title>{error ? "Não foi possível confirmar" : "Confirmação de e-mail"}</Title>
          <p>{message}</p>
          {!error && <p>Enviamos outro e-mail com as orientações para começar.</p>}
          <Button as={Link} to="/login">Ir para o login</Button>
        </SuccessDialog>
      </ContainerRegiter>
    </PageWrapper>
  );
};

export default VerifyEmailPage;
