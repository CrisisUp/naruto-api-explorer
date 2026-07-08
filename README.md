# 🍥 Naruto API Explorer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue)](https://expressjs.com/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-purple)](https://web.dev/progressive-web-apps/)

> Explore o universo Naruto com dados da API pública! Um projeto completo com backend Node.js, frontend responsivo e PWA.

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Execução](#-instalação-e-execução)
- [Como Usar](#-como-usar)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Contribuição](#-contribuição)
- [Licença](#-licença)
- [Contato](#-contato)

---

## 📖 Sobre o Projeto

**Naruto API Explorer** é uma aplicação web completa que permite explorar dados do universo Naruto e Boruto. O projeto consome APIs públicas de fãs, fornecendo informações detalhadas sobre personagens, clãs, jutsus e muito mais.

### 🎯 Objetivos

- Fornecer uma interface amigável para explorar dados do Naruto
- Demonstrar boas práticas de desenvolvimento com Node.js
- Implementar um sistema de fallback para alta disponibilidade
- Criar uma Progressive Web App (PWA) instalável
- Aplicar princípios de Clean Code

---

## ✨ Funcionalidades

### Backend

- ✅ **API RESTful** com 6 endpoints
- ✅ **Sistema de Fallback** com 2 APIs (Dattebayo + Naruto API)
- ✅ **Cache de dados** para melhor performance
- ✅ **Logs diferenciados** (Desktop/Mobile)
- ✅ **Configuração via .env**
- ✅ **Tratamento de erros robusto**

### Frontend

- ✅ **Design moderno** com tema Naruto
- ✅ **100% responsivo** (celular, tablet, desktop)
- ✅ **Busca por nome** de personagens
- ✅ **Personagem aleatório**
- ✅ **Top Jutsus** (ranking de técnicas)
- ✅ **Lista interativa** com imagens
- ✅ **Fallback de imagens** com imagens locais

### PWA (Progressive Web App)

- ✅ **Instalável** em qualquer dispositivo
- ✅ **Service Worker** para cache offline
- ✅ **Manifest.json** configurado
- ✅ **Ícones** para tela inicial

---

## 🛠️ Tecnologias Utilizadas

### Backend

| Tecnologia | Descrição |
| ---------- | --------- |
| [Node.js](https://nodejs.org/) | Ambiente de execução JavaScript |
| [Express](https://expressjs.com/) | Framework web para Node.js |
| [Axios](https://axios-http.com/) | Cliente HTTP para requisições |
| [CORS](https://www.npmjs.com/package/cors) | Middleware para CORS |
| [Dotenv](https://www.npmjs.com/package/dotenv) | Gerenciamento de variáveis de ambiente |
| [Jest](https://jestjs.io/) | Framework de testes |
| [Nodemon](https://nodemon.io/) | Auto-reload em desenvolvimento |

### Frontend

| Tecnologia | Descrição |
| ---------- | --------- |
| HTML5 | Estrutura semântica |
| CSS3 | Estilização com Grid e Flexbox |
| JavaScript (ES6+) | Lógica e interatividade |
| PWA | Manifest + Service Worker |

### APIs Consumidas

| API | Descrição |
| --- | --------- |
| [Dattebayo API](https://dattebayo-api.onrender.com) | API primária (dados completos) |
| [Naruto API](https://naruto-api-rsl3.onrender.com) | API secundária (fallback) |

---

## 📁 Estrutura do Projeto

```text
naruto-api-explorer/
├── backend/
│ ├── src/
│ │ ├── config/
│ │ │ └── index.js # Configurações centralizadas
│ │ ├── controllers/
│ │ │ └── characterController.js # Controlador MVC
│ │ ├── routes/
│ │ │ └── characters.js # Rotas da API
│ │ ├── services/
│ │ │ ├── apiService.js # Orquestrador de APIs
│ │ │ ├── dattebayoApi.js # API primária
│ │ │ └── narutoApiFallback.js # API fallback
│ │ ├── utils/
│ │ │ ├── logger.js # Logs estruturados
│ │ │ └── validators.js # Validações
│ │ ├── tests/ # Testes automatizados
│ │ └── app.js # Configuração do Express
│ ├── server.js # Ponto de entrada
│ ├── package.json
│ └── .env # Variáveis de ambiente
├── frontend/
│ ├── src/
│ │ ├── css/
│ │ │ └── style.css # Estilos principais
│ │ ├── js/
│ │ │ ├── app.js # Lógica principal
│ │ │ ├── config.js # Configurações do frontend
│ │ │ ├── services/
│ │ │ │ └── apiClient.js # Cliente API
│ │ │ └── utils/
│ │ │ ├── domUtils.js # Utilitários DOM
│ │ │ └── imageUtils.js # Utilitários de imagem
│ │ ├── images/
│ │ │ ├── jiraiya.png # Imagem local
│ │ │ └── icon-*.png # Ícones PWA
│ │ ├── index.html
│ │ ├── manifest.json # Configuração PWA
│ │ ├── sw.js # Service Worker
│ │ └── offline.html # Página offline
│ └── public/
│ └── images/
│ └── jiraiya.png # Imagem pública
├── package.json
└── README.md
```

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) (gerenciador de pacotes)
- [Git](https://git-scm.com/) (para clonar o repositório)

---

## 🚀 Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/naruto-api-explorer.git
cd naruto-api-explorer
```

### 2. Instale as dependências

```bash
npm install
```

1. Configure as variáveis de ambiente
Crie um arquivo .env na pasta backend/:

```bash
cd backend
cp .env.example .env
# Ou crie manualmente:
echo "PORT=3000
NODE_ENV=development
DATTEBAYO_API_URL=https://dattebayo-api.onrender.com
NARUTO_API_URL=https://naruto-api-rsl3.onrender.com/api/v1
CORS_ORIGIN=*
CACHE_TTL=300000" > .env
```

1. Execute o servidor

```bash
# Modo desenvolvimento (com nodemon)
npm run dev
```

## Modo produção

npm start
5. Acesse a aplicação
Local: <http://localhost:3000>

Celular (mesma rede Wi-Fi): http://[SEU_IP]:3000

1. Execute os testes

```bash
npm test
```

🎮 Como Usar
Interface Principal
Buscar personagem: Digite o nome e clique em "Buscar"
Personagem aleatório: Clique no botão 🎲
Top Jutsus: Veja os personagens com mais técnicas
Lista de personagens: Clique em qualquer card para ver detalhes

Recursos PWA
Instalar no celular: Adicione à tela inicial
Offline: Funciona sem internet (com cache)
App nativo: Abre em janela própria sem barra de endereço

## 📡 API Endpoints

| Método | Endpoint | Descrição |
| ------ | -------- | --------- |
| GET | /api/characters | Lista todos os personagens |
| GET | /api/characters/:id | Busca personagem por ID |
| GET | /api/characters/search/:name | Busca personagem por nome |
| GET | /api/characters/search?q= | Busca geral por nome/clã |
| GET | /api/characters/top-jutsu | Top 5 com mais jutsus |
| GET | /api/characters/status | Status do sistema (fallback) |
| GET | /health | Health check |

## Exemplos de Uso

```bash
# Listar todos os personagens
curl http://localhost:3000/api/characters

# Buscar Naruto
curl http://localhost:3000/api/characters/search/Naruto%20Uzumaki

# Buscar por ID (Naruto = 1344)
curl http://localhost:3000/api/characters/1344

# Top Jutsus
curl http://localhost:3000/api/characters/top-jutsu

# Status do sistema
curl http://localhost:3000/api/characters/status
```

## 📸 Screenshots

```Desktop
┌─────────────────────────────────────────────────────┐
│  🍥 Naruto API Explorer                             │
│  Explore o universo Naruto com dados da API pública │
│                                                     │
│  [🔍 Buscar personagem...] [Buscar] [🏆] [🎲]       │
│                                                     │
│  ┌─────────────-┐  ┌─────────────┐  ┌─────────────┐ │
│  │  🖼️ Naruto   │  │  🖼️ Sasuke  │  │  🖼️ Kakashi │ │
│  │  Uzumaki     │  │  Uchiha     │  │  Hatake     │ │
│  │  Clã Uzumaki │  │  Clã Uchiha │  │  Clã Hatake │ │
│  └─────────────-┘  └─────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────┘
```

```Mobile
┌──────────────────┐
│ 🍥 Naruto API    │
│ ──────────────── │
│ [🔍 Buscar...]   │
│ [Buscar] [🏆]    │
│ [🎲]             │
│ ┌──────────────┐ │
│ │  🖼️ Naruto   │ │
│ │  Uzumaki     │ │
│ │  Clã Uzumaki │ │
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │  🖼️ Sasuke   │ │
│ │  Uchiha      │ │
│ │  Clã Uchiha  │ │
│ └──────────────┘ │
└──────────────────┘
```

## 🗺️ Roadmap

### 🚀 Futuras Melhorias

- Sistema de Favoritos (localStorage)
- Modo Escuro/Claro
- Comparar Personagens lado a lado
- Galeria de Imagens dos personagens
- Páginação na lista de personagens
- Exportar Dados (JSON/CSV)
- Deploy no Render/Vercel
- Tradução para inglês
- Compartilhar personagem nas redes sociais

## 🤝 Contribuição

Contribuições são bem-vindas! Siga os passos:

- Fork o projeto
- Crie uma branch para sua feature:

```bash
git checkout -b feature/nova-funcionalidade
```

- Commit suas mudanças:

```bash
git commit -m "✨ Adiciona nova funcionalidade"
```

- Push para a branch:

```bash
git push origin feature/nova-funcionalidade
```

- Abra um Pull Request

## 📄 Licença

Distribuído sob a licença MIT. Veja LICENSE para mais informações.

## 📧 Contato

Link do Projeto: <https://github.com/CrisisUp/naruto-api-explorer>

## 🙏 Agradecimentos

- Dattebayo API - API primária
- Naruto API - API fallback
- Projeto Gutenberg - Livros públicos (usados nos testes)
- Naruto Wiki - Dados dos personagens

## ⭐ Mostre seu apoio

Se este projeto te ajudou, dê uma ⭐ no GitHub!
Feito com ❤️ e 🍥 por Cristiano

---

## 🎨 **Como adicionar imagens ao README (screenshots):**

Crie uma pasta `screenshots`:

```bash
mkdir -p docs/screenshots
```

Adicione imagens e referencie no README:

markdown

## 📸 Screenshots

### Desktop

![Desktop View](./docs/screenshots/desktop.png)

### Mobile

![Mobile View](./docs/screenshots/mobile.png)
