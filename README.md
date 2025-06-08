## Visão Geral da Configuração

Este guia aborda a configuração do ambiente de desenvolvimento local e a execução do projeto utilizando Docker Compose. A configuração local (NVM, Node.js, dependências NPM) é recomendada para tarefas de desenvolvimento como linting, testes e melhor suporte da IDE. A execução principal, incluindo a API, banco de dados e mensageria, é gerenciada via Docker Compose.

## Pré-requisitos

*   Git
*   nvm (Node Version Manager) ([Instalação](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating))
*   Node.js (instalado via nvm)
*   npm (instalado com Node.js)
*   Docker ([Instalação](https://docs.docker.com/engine/install/))

## Configuração do Ambiente de Desenvolvimento Local

Siga estes passos para configurar seu ambiente local para desenvolvimento.

### 1. Clonar o Repositório
Clone o projeto para a sua máquina local:
```bash
git clone https://github.com/ImFelipeOliveira/content-flow.git
```
_Nota: O comando `api-content-flow` assume que este é o diretório raiz do projeto da API após o clone. Ajuste se a estrutura do seu repositório for diferente._

### 2. Instalar o nvm (Node Version Manager)
O nvm permite gerenciar múltiplas versões do Node.js. Se ainda não o tiver, instale-o:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```
Após a instalação, pode ser necessário fechar e reabrir o terminal ou executar os seguintes comandos para carregar o nvm:
```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```
Para verificar a instalação, execute:
```bash
nvm --version
```

### 3. Instalar Node.js
Use o nvm para instalar a versão LTS do Node.js
```bash
nvm install --lts
nvm use --lts
```
Verifique as instalações:
```bash
node --version
npm --version
```

### 4. Instalar as Dependências
Instale as dependências do projeto usando npm:
```bash
npm install
```

### 5. Configurar Variáveis de Ambiente
O projeto utiliza variáveis de ambiente para configuração.
Copie o arquivo de exemplo `.env-example` para um novo arquivo chamado `.env`:
```bash
cp .env-example .env
```
Abra o arquivo `.env` e configure as seguintes variáveis de acordo com o seu ambiente:

```env
# TIMEZONE
TZ='America/Boa_Vista'

JWT_SECRET=''

# API 
API_URL='http://localhost:3000'
API_PORT='3000'

# DATABASE
DB='pg'
DB_HOST='contentflow-db'
DB_PORT='5432'
DB_USER='postgres'
DB_PASSWORD='postgres'
DB_NAME='content-flow'

# MESSAGE BROKER (RabbitMQ)
RABBITMQ_HOST=
RABBITMQ_PORT=
RABBITMQ_USER=
RABBITMQ_PASS=

# SMTP
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```
**Notas Importantes sobre `.env` para Docker:**
*   **`JWT_SECRET`**: Defina um valor forte e único.
*   **Nomes dos Serviços Docker**: `DB_HOST` (e.g., `contentflow-db`) e `RABBITMQ_HOST` (e.g., `contentflow-rabbitmq`) devem corresponder aos nomes dos serviços definidos no seu arquivo `docker-compose-dev.yaml`.
*   **Credenciais de Serviços**: As credenciais para o banco (`DB_USER`, `DB_PASSWORD`) e RabbitMQ (`RABBITMQ_USER`, `RABBITMQ_PASS`) devem estar alinhadas com as configurações desses serviços no `docker-compose-dev.yaml`.
*   **`API_PORT`**: Esta é a porta que a aplicação Node.js escuta *dentro* do seu container. O `docker-compose-dev.yaml` mapeia esta porta para uma porta na sua máquina host (ex: `3000:3000`), tornando a API acessível via `API_URL`.

## Executando o Projeto com Docker Compose

Com Docker, Docker Compose instalados, e o arquivo `.env` configurado, você pode iniciar todo o ambiente (API, banco de dados, mensageria):

Para construir as imagens Docker (necessário na primeira vez ou após alterações no `Dockerfile` ou código que afete a imagem) e iniciar os serviços:
```bash
npm run up-dev-build
```

Se as imagens já foram construídas e você quer apenas iniciar os serviços:
```bash
npm run up-dev
```
Após a execução, a API deverá estar acessível em `http://localhost:3000` (ou na URL/porta que você configurou em `API_URL` e mapeou no Docker Compose).

### Parando os Serviços Docker
Para parar todos os serviços iniciados pelo Docker Compose:
```bash
docker-compose -f docker-compose-dev.yaml down
```

## Scripts NPM Adicionais

*   `npm test`: Executa os testes (pode requerer configuração adicional ou que os serviços de banco/mensageria estejam acessíveis, dependendo da implementação dos testes).
*   `npm run coverage`: Gera o relatório de cobertura de testes.
