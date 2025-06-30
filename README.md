# Content Flow - API

Uma API para gerenciamento de conteúdo, construída com TypeScript, Node.js e clear-architecture.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Git** - Para controle de versão
- **SSH configurado com GitHub** - Para acesso aos repositórios privados
- **Node.js** (via nvm) - Ambiente de execução JavaScript
- **npm** - Gerenciador de pacotes (instalado com Node.js)
- **Docker** - Para containerização ([Instalação](https://docs.docker.com/engine/install/))
- **Ansible** - Para automação de configuração ([Instalação](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html))

### Instalação do NVM e Node.js

Siga as instruções oficiais para instalar o NVM: [NVM Installation Guide](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating)

Após instalar o NVM:

## Instalar e usar a versão LTS do Node.js

```bash
nvm install --lts
nvm use --lts
```

## 🚀 Configuração Rápida

### 1. Clonar o Repositório

```bash
git clone git@github.com:F3-Organization/api-content-flow.git
cd api-content-flow
```

### 2. Setup Completo (Recomendado)

Execute o comando abaixo para configurar tudo automaticamente:

```bash
npm run setup-dev
```

Este comando irá:

- ✅ Configurar as variáveis de ambiente (.env)
- ✅ Instalar todas as dependências
- ✅ Construir e iniciar os containers Docker

### 3. Iniciar Desenvolvimento

```bash
npm run up-dev
```

## 📝 Scripts Disponíveis

| Script                   | Descrição                                 |
| ------------------------ | ----------------------------------------- |
| `npm run setup-env`      | Configura variáveis de ambiente (.env)    |
| `npm run setup-dev`      | Setup completo para desenvolvimento       |
| `npm run up-dev`         | Inicia containers Docker                  |
| `npm run up-dev-build`   | Inicia containers Docker com rebuild      |
| `npm run test`           | Executa testes unitários                  |
| `npm run coverage`       | Executa testes com relatório de cobertura |
| `npm run update-swagger` | Atualiza documentação Swagger             |

## 🔐 Como Funciona a Configuração Automática

O projeto utiliza **Ansible** para automatizar a configuração das variáveis de ambiente:

1. **Repositório de Configurações**: As variáveis ficam em um repositório privado separado
2. **Chave SSH**: Usa sua chave SSH local (`~/.ssh/id_ed25519`) para acessar o repositório
3. **Automação**: O Ansible clona o repositório e copia o arquivo `.env.development`
4. **Segurança**: Suas credenciais ficam seguras e não são versionadas no código

### Estrutura do Repositório de Configurações

```
config-repo/
└── .env.development
```

## 🏗️ Arquitetura do Projeto

```
src/
├── application/     # Casos de uso e lógica de aplicação
├── domain/         # Entidades e regras de negócio
├── infra/          # Infraestrutura (DB, HTTP, etc.)
└── config/         # Configurações da aplicação
```

## 📚 Documentação Adicional

- **API Documentation**: Acesse `http://localhost:1500/api/swagger-docs/` quando o servidor estiver rodando
- **Database Schema**: Consulte `docs/database/DDL.sql`
- **Docker Compose**: Configuração em `docker-compose-dev.yaml`

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Copyright (c) 2025 Felipe Oliveira Souza. Todos os direitos reservados.
