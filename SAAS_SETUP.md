# Uso por organização

Entre com e-mail/senha ou Google. Em `/organizations`, escolha uma organização
existente ou crie uma nova. Cada conta pode participar de várias organizações.

Proprietários, administradores e líderes acessam `/organization-settings` pelo
menu Convites. Eles informam e-mail, validade e funções. O link criado só funciona
com a conta daquele e-mail e pode ser cancelado antes da aceitação.

Ao abrir `/invite/{slug}/{token}`, a pessoa pode entrar ou criar conta e voltar
ao convite. Cadastro cria somente a identidade da pessoa. As permissões vêm da
participação na organização e são validadas também pelo backend.

Só `MusicLinksService` lê o Firestore diretamente com `onSnapshot`, dentro de
`organizations/{id}/musicLinks`. Todos os demais dados passam pela API.
O backend retorna `firebaseCustomToken` no login e em `/auth/me`, permitindo
recuperar a sessão Firebase. Esse custom token não é gravado no localStorage.

Use as regras e índices versionados no repositório backend `functions-schedule`,
e configure frontend e backend para o mesmo projeto Firebase. A migração de
dados antigos e configuração de e-mails estão no `SAAS_SETUP.md` do backend.

O frontend e o backend devem ser publicados juntos. O acesso compartilhado
antigo como visitante não é convertido em acesso a organizações novas.

O PWA mantém os arquivos estáticos em cache, mas não salva respostas privadas
da API. A troca de organização desmonta os estados e listeners do grupo anterior.
