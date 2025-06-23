# Login App

Este projeto é um sistema de autenticação e administração de usuários, desenvolvido em Next.js (App Router) com React, TailwindCSS e integração com uma API RESTful.

## Funcionalidades

- Cadastro, login e logout de usuários
- Listagem, edição e exclusão de usuários (admin)
- Alteração de permissões (roles) dos usuários
- Edição de perfil e troca de senha
- Controle de acesso por token JWT
- Interface responsiva e moderna

## Tecnologias Utilizadas

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [JWT Decode](https://github.com/auth0/jwt-decode) (para obter dados do usuário logado)
- [API RESTful](https://github.com/seu-backend) (backend externo)

## Como rodar o projeto

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/login-app.git
   cd login-app
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure as variáveis de ambiente:**
   - Edite o arquivo `.env.local` (ou `.env`) com a URL da sua API:
     ```
     NEXT_PUBLIC_API_HOST=http://localhost:3001/api/v1
     ```

4. **Rode o projeto:**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. **Acesse no navegador:**
   ```
   http://localhost:3000
   ```

## Estrutura de Pastas

```
src/
  app/
    admin/users/    # Tela de administração de usuários
    profile/        # Tela de perfil do usuário
    register/       # Tela de cadastro
    login/          # Tela de login
  components/       # Componentes reutilizáveis (Header, Loading, Modals, etc)
  @types/           # Tipos TypeScript globais
```

## Variáveis de Ambiente

- `NEXT_PUBLIC_API_HOST`: URL base da API backend (ex: http://localhost:3001/api/v1)

## Observações

- Para funcionamento completo, é necessário rodar a API backend compatível.
- O sistema utiliza JWT salvo no localStorage para autenticação.
- Apenas usuários com permissão de admin podem acessar a área de administração.

## Licença

Este projeto é open-source e está sob a licença MIT.