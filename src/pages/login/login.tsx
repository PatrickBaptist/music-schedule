import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import useAuthContext from "../../context/hooks/useAuthContext";
import { Button, Container, FormWrapper, Input, Logo, RegisterPrompt } from "./loginStyle";
import logo from "../../assets/imgs/logo.png";
import PageWrapper from "../../components/pageWrapper/pageWrapper";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Aguarde...");
    try {
      await login(email, password);
      toast.dismiss(toastId);
      navigate("/");
    } catch (err: unknown) {
        if (err instanceof Error) {
            toast.error(err.message, { id: toastId });
        } else {
            toast.error("Erro desconhecido ao fazer login", { id: toastId });
        }
    }
  };

  return (
    <PageWrapper>
      <Container>
        <FormWrapper onSubmit={handleLogin}>
          <Logo src={logo} alt="Logo do Site" />

          <Input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-3 border rounded-md"
            required
            />

          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-3 border rounded-md"
            required
            />

          <Button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
            Entrar
          </Button>
          <RegisterPrompt>
            Não possui conta?
            <Link to="/register">Cadastre-se</Link>
          </RegisterPrompt>
        </FormWrapper>
      </Container>
    </PageWrapper>
  );
};

export default LoginPage;
