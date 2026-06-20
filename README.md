# Music Schedule

Frontend em React para organizar a rotina do ministério de louvor. O sistema junta agenda, músicas, usuários, avisos e auditoria em uma interface única, com controle por perfil de acesso.

## O que esse frontend faz

- Mostra a escala do próximo domingo e a escala de ministros da quinta-feira.
- Permite cadastrar, editar, remover e pesquisar músicas.
- Permite adicionar músicas da lista geral para a escala do domingo.
- Exibe escalas especiais e eventos do mês.
- Mostra avisos e notificações para usuários autenticados.
- Permite cadastro, login e entrada como visitante.
- Lista usuários com busca, edição de dados, funções e status.
- Exibe auditoria de ações do sistema para perfis autorizados.
- Mostra o perfil do usuário logado.
- Funciona como "PWA", com suporte a instalação e atualização automática.

## Perfis e permissões

O frontend trabalha com os seguintes papéis: 

- `admin`
- `leader`
- `minister`
- `vocal`
- `guitar`
- `keyboard`
- `bass`
- `drums`
- `violao`
- `sound`
- `lighting`
- `midia`
- `datashow`
- `guest`

Regras principais:

- `guest` tem acesso reduzido.
- `audit` fica restrito a `admin` e `leader`.
- Cadastro e edição de músicas usam permissões por papel.
- A edição de usuários também depende do perfil logado.

## Telas do sistema

### `Login`

- Entrada com e-mail e senha.
- Opção de continuar como visitante.
- Link para criação de conta.

### `Cadastro`

- Cadastro com nome, apelido, e-mail, telefone, data de nascimento, senha e funções.
- Confirmação de senha.

### `Início`

- Card da escala do próximo domingo.
- Lista de músicas de louvor.
- Escalas especiais.
- Escala de ministros de quinta-feira.
- Avisos ativos.
- Bloco de aniversariantes do mês.
- Modal para adicionar música quando o papel permite.

### `Escala`

- Visualização da escala mensal.
- Edição e geração de escalas via contexto de agenda.

### `Canções`

- Lista paginada de músicas.
- Busca por nome.
- Cadastro, edição e exclusão.
- Abertura de vídeo, Spotify e demais links.
- Inclusão da música na escala do domingo com escolha do momento do culto.

### `Usuários`

- Busca por nome, e-mail, função e status.
- Exibição de usuário online, pendente, ativo ou desativado.
- Edição em modal para `admin` e `leader`.
- Acesso rápido para auditoria.

### `Auditoria`

- Lista de eventos auditados.
- Atualização automática em intervalo curto.
- Botão manual de recarga.

### `Perfil`

- Dados do usuário logado.
- Funções organizadas por prioridade.
- Área para enviar notificação e aviso, se o papel permitir.

## Stack usada

- `React 18`
- `TypeScript`
- `Vite`
- `react-router-dom`
- `styled-components`
- `framer-motion`
- `sonner`
- `firebase`
- `vite-plugin-pwa`
- `@dnd-kit/*`
- `react-icons`
- `react-input-mask`

## Arquitetura do frontend

- `AuthProvider` cuida de login, logout, cadastro e sessão.
- `UsersProvider` gerencia usuários e status online.
- `SchedulesProvider` gerencia a agenda mensal e escalas especiais.
- `MusicLinksProvider` lida com links de música em tempo real.
- `AllMusicLinksProvider` controla a lista geral com paginação.
- `NotificationProvider` lê e grava avisos e notificações.
- `ServerProvider` aguarda o backend responder antes de liberar a tela.
- `ThemePreferenceProvider` controla tema claro, escuro ou do sistema.
- `ScrollProvider` e `PageWrapper` ajudam na navegação e no comportamento visual.

## Integrações

O frontend usa:

- "Backend HTTP" via `VITE_API_URL_PRODUTION`.
- "Firebase Firestore" para dados em tempo real como músicas, usuários e escalas.
- "Service Worker" para atualização automática e funcionamento como aplicativo instalado.

## Variáveis de ambiente

As variáveis esperadas ficam no `.env.development` ou no ambiente de deploy:

```env
VITE_API_URL_PRODUTION=http://localhost:3000
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Estrutura principal

- `src/App.tsx` monta header, footer, rotas e comportamento global.
- `src/main.tsx` registra providers, router, toast e estilos globais.
- `src/pages/` contém as telas.
- `src/components/` contém os blocos reutilizáveis.
- `src/services/` concentra integrações com API e Firestore.
- `src/context/` guarda providers e hooks de estado global.
- `public/` guarda ícones, imagens e arquivos públicos do PWA.

## Deploy

O projeto já tem configuração para deploy com fallback de SPA no Netlify.

## Observações

- O layout é responsivo, com header no desktop e footer no mobile.
- O app bloqueia partes da navegação para visitantes.
- Atualizações de versão aparecem com toast de confirmação.
- Se o backend estiver indisponível, a tela fica aguardando liberação pelo "ping".
