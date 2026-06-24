import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button, ContainerRegiter, FieldContainer, FormWrapper, Input, Label, LoginPrompt, RoleItem, RolesContainer, RolesLabel, StyledInputMask, Title } from "./registerStyle";
import { roleOptions, UserRole } from "../../types/UserRole";
import useAuthContext from "../../context/hooks/useAuthContext";
import PageWrapper from "../../components/pageWrapper/pageWrapper";
import { motion } from "framer-motion";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  // Estados do Fluxo de Igreja
  const [churchFlow, setChurchFlow] = useState<'select' | 'create' | 'join'>('select');
  const [churchName, setChurchName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  // Seus Estados Originais do Formulário
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [roles, setRoles] = useState<string[]>([]);

  const { registerUser } = useAuthContext();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem!");
      return;
    }
    
    const toastId = toast.loading("Aguarde...");
    try {
      // 💡 O Payload agora leva os dados da igreja acoplados de forma transparente
      const payload = {
        name,
        nickname,
        email,
        password,
        birthDate,
        phone,
        roles,
        // Informações da arquitetura multi-igreja
        churchFlow, 
        churchName: churchFlow === 'create' ? churchName : undefined,
        inviteCode: churchFlow === 'join' ? inviteCode : undefined
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

          {/* 🌟 PASSO 1A: SELEÇÃO DO TIPO DE CADASTRO */}
          {churchFlow === 'select' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', margin: '20px 0' }}>
              <RolesLabel style={{ textAlign: 'center', fontSize: '1.1rem', marginBottom: '10px' }}>
                Como deseja começar no sistema?
              </RolesLabel>
              <Button type="button" onClick={() => setChurchFlow('create')}>
                Cadastrar Minha Igreja (Gestor Geral)
              </Button>
              <Button type="button" style={{ backgroundColor: '#28a745' }} onClick={() => setChurchFlow('join')}>
                Fui Convidado (Inserir Código)
              </Button>
              <LoginPrompt style={{ textAlign: 'center' }}>
                Já possui conta? <Link to="/login">Entre</Link>
              </LoginPrompt>
            </div>
          )}

          {/* 🌟 PASSO 1B: INFORMAÇÕES DA IGREJA ANTES DE EXIBIR O RESTANTE */}
          {churchFlow === 'create' && !name && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <RolesLabel>Nome da sua Igreja ou Comunidade</RolesLabel>
              <Input 
                placeholder="Ex: Igreja Batista Manancial" 
                value={churchName} 
                onChange={e => setChurchName(e.target.value)} 
                required 
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <Button type="button" onClick={() => { if(churchName.trim()) setName(" ") }} disabled={!churchName.trim()}>
                  Avançar para Meus Dados
                </Button>
                <Button type="button" style={{ backgroundColor: '#6c757d' }} onClick={() => { setChurchName(""); setChurchFlow('select'); }}>
                  Voltar
                </Button>
              </div>
            </div>
          )}

          {churchFlow === 'join' && !name && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <RolesLabel>Código de Convite da Igreja</RolesLabel>
              <Input 
                placeholder="Cole o código gerado pelo seu líder" 
                value={inviteCode} 
                onChange={e => setInviteCode(e.target.value)} 
                required 
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <Button type="button" onClick={() => { if(inviteCode.trim()) setName(" ") }} disabled={!inviteCode.trim()}>
                  Avançar para Meus Dados
                </Button>
                <Button type="button" style={{ backgroundColor: '#6c757d' }} onClick={() => { setInviteCode(""); setChurchFlow('select'); }}>
                  Voltar
                </Button>
              </div>
            </div>
          )}

          {/* 🌟 PASSO 2: EXIBIÇÃO DO FORMULÁRIO DE DADOS PESSOAIS */}
          {churchFlow !== 'select' && name && (
            <>
              {/* Resetador interno do "hack" do nome para renderizar limpo */}
              <Input 
                placeholder="Nome e sobrenome" 
                value={name === " " ? "" : name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
              <Input placeholder="Apelido" value={nickname} onChange={e => setNickname(e.target.value)} required />
              <Input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
              <StyledInputMask mask="(99) 9 9999-9999" placeholder="Telefone (xx) x xxxx-xxxx" value={phone} onChange={e => setPhone(e.target.value)} maskChar="" required />

              <FieldContainer> 
                <Label htmlFor="birthDate">Data de aniversário</Label>
              </FieldContainer>
              <Input type="date" placeholder="Data de nascimento" value={birthDate} onChange={e => setBirthDate(e.target.value)} required />

              <div className="show-password" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '5px 0' }}>
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
                {roleOptions
                  .filter(role => role.value !== UserRole.Guest)
                  .map((role) => (
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

              <Button type="submit">Concluir Cadastro</Button>

              <div style={{ width: '100%', textAlign: 'center', marginTop: '10px' }}>
                <span 
                  style={{ color: '#007bff', cursor: 'pointer', fontSize: '0.9rem' }} 
                  onClick={() => { setName(""); setChurchName(""); setInviteCode(""); setChurchFlow('select'); }}
                >
                  ↩ Alterar tipo de cadastro/igreja
                </span>
              </div>
            </>
          )}

        </FormWrapper>
      </ContainerRegiter>
    </PageWrapper>
  );
};

export default RegisterPage;