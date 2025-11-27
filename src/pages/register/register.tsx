import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button, ContainerRegiter, FieldContainer, FormWrapper, Input, Label, LoginPrompt, RoleItem, RolesContainer, RolesLabel, StyledInputMask, Title } from "./registerStyle";
import { roleOptions } from "../../types/UserRole";
import useAuthContext from "../../context/hooks/useAuthContext";
import PageWrapper from "../../components/pageWrapper/pageWrapper";
import { motion } from "framer-motion";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [roles, setRoles] = useState<string[]>([]);

  const { registerUser} = useAuthContext()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem!");
      return;
    }
    
    const toastId = toast.loading("Aguarde...");
    try {
      const payload = {
      name,
      nickname,
      email,
      password,
      birthDate,
      phone,
      roles,
    };

      await registerUser(payload);
      toast.success("Cadastro realizado com sucesso!", { id: toastId });
      navigate("/login");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro desconhecido ao cadastrar";
      toast.error(message, { id: toastId });
    }
  };

  return (
    <PageWrapper>
      <ContainerRegiter>
        <FormWrapper onSubmit={handleRegister}>
          <Title>Cadastro</Title>

          <Input placeholder="Nome e sobrenome" value={name} onChange={e => setName(e.target.value)} required />
          <Input placeholder="Apelido" value={nickname} onChange={e => setNickname(e.target.value)} required />
          <Input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
          <StyledInputMask mask="(99) 9 9999-9999" placeholder="Telefone (xx) x xxxx-xxxx" value={phone} onChange={e => setPhone(e.target.value)} maskChar="" required />

          <FieldContainer> 
              <Label htmlFor="birthDate">Data de aniversário</Label>
          </FieldContainer>
          
          <Input type="date" placeholder="Data de nascimento" value={birthDate} onChange={e => setBirthDate(e.target.value)} required />

          <div className="show-password">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(prev => !prev)}
              id="showPassword"
            />
            <Label htmlFor="showPassword">Mostrar senha</Label>
          </div>
          <Input id="password" type={showPassword ? "text" : "password"} placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required />
          <Input id="confirmPassword" type={showPassword ? "text" : "password"} placeholder="Confirme a senha" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />

          <FieldContainer>
              <RolesLabel htmlFor="roles">
                  Selecione suas funções no ministério de louvor
              </RolesLabel>
          </FieldContainer>
          <RolesContainer>

              {roleOptions.map((role) => (
                  <RoleItem key={role.value}>
                    <motion.input
                      type="checkbox"
                      id={role.value}
                      value={role.value}
                      checked={roles.includes(role.value)}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (e.target.checked) {
                          setRoles([...roles, value]);
                        } else {
                          setRoles(roles.filter((r) => r !== value));
                        }
                      }}
                      whileTap={{ scale: 1.2 }}
                      whileHover={{ scale: 1.05 }}
                      // animação ao marcar/desmarcar
                      animate={{
                        backgroundColor: roles.includes(role.value) ? "#3fb950" : "#fff",
                        borderColor: roles.includes(role.value) ? "#3fb950" : "#ccc",
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                    <label htmlFor={role.value}>{role.label}</label>
                  </RoleItem>
              ))}
          </RolesContainer>

          <Button type="submit">Cadastrar</Button>

          <LoginPrompt>
              Já possui conta?
          <Link to="/login">Entre</Link>
          </LoginPrompt>

        </FormWrapper>
      </ContainerRegiter>
    </PageWrapper>
  );
};

export default RegisterPage;