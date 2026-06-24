import React, { useState } from 'react';

export const RegisterChurch: React.FC = () => {
  const [flowType, setFlowType] = useState<'select' | 'create' | 'join'>('select');
  const [churchName, setChurchName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateChurch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Aqui enviaremos para o back-end criar a igreja e retornar o churchId
      console.log("Criando igreja:", churchName);
      // const response = await api.post('/churches', { name: churchName });
      // Depois, prossegue para o cadastro do usuário passando esse churchId e o role "admin_geral"
    } catch (error) {
      console.error("Erro ao criar igreja", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinChurch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Aqui validaremos o código de convite no back-end para descobrir qual é a igreja
      console.log("Validando código:", inviteCode);
      // const response = await api.get(`/churches/invite/${inviteCode}`);
      // Se válido, prossegue para o cadastro salvando o churchId retornado e o role "member"
    } catch (error) {
      console.error("Código inválido", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      {flowType === 'select' && (
        <div style={{ textAlign: 'center' }}>
          <h2>Bem-vindo ao Portal de Escalas</h2>
          <p>Escolha como deseja começar:</p>
          <button 
            onClick={() => setFlowType('create')}
            style={{ display: 'block', width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cadastrar Minha Igreja (Gestor Geral)
          </button>
          <button 
            onClick={() => setFlowType('join')}
            style={{ display: 'block', width: '100%', padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Tenho um Código de Convite
          </button>
        </div>
      )}

      {flowType === 'create' && (
        <form onSubmit={handleCreateChurch}>
          <h3>Cadastrar Nova Igreja</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Nome da Igreja ou Comunidade:</label>
            <input 
              type="text" 
              value={churchName} 
              onChange={(e) => setChurchName(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              placeholder="Ex: IBMM Louvor"
            />
          </div>
          <button type="submit" disabled={loading} style={{ padding: '10px 15px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', marginRight: '10px' }}>
            {loading ? 'Criando...' : 'Avançar para Cadastro'}
          </button>
          <button type="button" onClick={() => setFlowType('select')} style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px' }}>
            Voltar
          </button>
        </form>
      )}

      {flowType === 'join' && (
        <form onSubmit={handleJoinChurch}>
          <h3>Inserir Código de Convite</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Código recebido pelo seu gestor:</label>
            <input 
              type="text" 
              value={inviteCode} 
              onChange={(e) => setInviteCode(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              placeholder="Ex: CH-1234-XYZ"
            />
          </div>
          <button type="submit" disabled={loading} style={{ padding: '10px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', marginRight: '10px' }}>
            {loading ? 'Validando...' : 'Verificar Código'}
          </button>
          <button type="button" onClick={() => setFlowType('select')} style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px' }}>
            Voltar
          </button>
        </form>
      )}
    </div>
  );
};