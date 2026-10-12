import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Button,
  ContainerRegiter,
  Divider,
  FieldContainer,
  FormWrapper,
  GoogleButton,
  Input,
  Label,
  LoginPrompt,
  SuccessDialog,
  SuccessIcon,
  SuccessOverlay,
  StyledInputMask,
  Title,
} from "./registerStyle";

import useAuthContext from "../../context/hooks/useAuthContext";
import PageWrapper from "../../components/pageWrapper/pageWrapper";

import { FcGoogle } from "react-icons/fc";
import { FaCheck } from "react-icons/fa";
import useBodyScrollLock from "../../context/hooks/useBodyScrollLock";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from || "/";

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState("");
  const loginButtonRef = useRef<HTMLButtonElement>(null);

  const { registerUser, loginWithGoogle } = useAuthContext();
  useBodyScrollLock(Boolean(registrationMessage));

  useEffect(() => {
    if (registrationMessage) loginButtonRef.current?.focus();
  }, [registrationMessage]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("As senhas nao coincidem!");
      return;
    }



    const toastId = toast.loading("Enviando cadastro...");
    setIsSubmitting(true);
    try {
      const payload = {
        name,
        nickname,
        email,
        password,
        birthDate,
        phone,

      };

      const result = await registerUser(payload);
      toast.dismiss(toastId);
      setRegistrationMessage(result.message || "Seu cadastro foi recebido com sucesso.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido ao cadastrar";
      toast.error(message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
    const toastId = toast.loading("Entrando com Google...");
    try {
      const result = await loginWithGoogle();
      toast.success(result.message, { id: toastId });
      navigate(redirectTo, { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message, { id: toastId });
      } else {
        toast.error("Erro desconhecido ao cadastrar com Google", { id: toastId });
      }
    }
  };

  return (
    <PageWrapper>
      <ContainerRegiter>
        <FormWrapper onSubmit={handleRegister}>
          <Title>Cadastro</Title>

          <GoogleButton type="button" onClick={handleGoogleRegister}>
            <FcGoogle />
            Cadastrar com Google
          </GoogleButton>

          <Divider>ou</Divider>

          <Input placeholder="Nome e sobrenome" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input placeholder="Apelido" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
          <Input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <StyledInputMask
            mask="(99) 9 9999-9999"
            placeholder="Telefone (xx) x xxxx-xxxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maskChar=""
            required
          />

          <FieldContainer>
            <Label htmlFor="birthDate">Data de aniversario</Label>
          </FieldContainer>

          <Input type="date" placeholder="Data de nascimento" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />

          <div className="show-password">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
              id="showPassword"
            />
            <Label htmlFor="showPassword">Mostrar senha</Label>
          </div>
          <Input id="password" type={showPassword ? "text" : "password"} placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Confirme a senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <p>Suas funções serão definidas dentro de cada organização.</p>



          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Cadastrar"}
          </Button>

          <LoginPrompt>
            Ja possui conta?
            <Link to="/login" state={{ from: redirectTo }}>Entre</Link>
          </LoginPrompt>
        </FormWrapper>

        {registrationMessage && (
          <SuccessOverlay>
            <SuccessDialog
              role="dialog"
              aria-modal="true"
              aria-labelledby="registration-success-title"
              aria-describedby="registration-success-description"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
            >
              <SuccessIcon aria-hidden="true">
                <FaCheck />
              </SuccessIcon>
              <span>Cadastro enviado</span>
              <h2 id="registration-success-title">Sua conta está pronta</h2>
              <p id="registration-success-description">{registrationMessage}</p>
              <p>Entre com seu e-mail e sua senha para aceitar o convite ou criar sua organização.</p>
              <Button
                ref={loginButtonRef}
                type="button"
                onClick={() => navigate("/login", { state: { from: redirectTo } })}
              >
                Ir para o login
              </Button>
            </SuccessDialog>
          </SuccessOverlay>
        )}
      </ContainerRegiter>
    </PageWrapper>
  );
};

export default RegisterPage;
