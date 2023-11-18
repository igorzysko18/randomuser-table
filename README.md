# randomuser-table
Tabela de usuários da api randomuser

## Rodando Localmente
### Backend
Para rodar a API backend localmente, siga os passos abaixo:
1. Navegue até a pasta da API backend:
    cd backend
2. Instale as dependências:
    npm install
3. Inicie o servidor:
    npm start
4. Certifique-se de ajustar o arquivo `.env` com a URL do seu banco de dados PostgreSQL.
### Frontend
Para rodar o frontend localmente, siga os passos abaixo:
1. Navegue até a pasta do frontend:
    cd frontend
2. Instale as dependências:
    npm install
3. Inicie o servidor:
    npm start

## Rodando via Docker

Para rodar o projeto via Docker, execute o seguinte comando na raiz do projeto:
docker compose up --build

Isso iniciará as imagens e os contêineres Docker necessários para o projeto.
Ou pode optar por rodar os builds individuais em cada pasta do projeto, backend, frontend e postgres.