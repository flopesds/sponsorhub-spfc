# SponsorHub SPFC 🔴⚪⚫

Plataforma de gestão integrada de patrocínios, contratos e contrapartidas para propriedades esportivas de alto rendimento. Desenvolvida para centralizar a governança de entregas de marca, prazos contratuais e conformidade operacional em dias de jogo e ativações institucionais.

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.19.3-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Cloud-336791?logo=postgresql)](https://neon.tech/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)
[![Status](https://img.shields.io/badge/Status-Produção-success)]()

---

## 📌 Visão Geral

O **SponsorHub SPFC** foi projetado para suprir os desafios críticos da gestão de marketing esportivo em clubes de futebol com alto volume de parceiros comerciais. A aplicação elimina controles manuais e planilhas dispersas, oferecendo visão em tempo real do ciclo de vida dos contratos e o cumprimento de entregas negociadas (exposição estática, hospitalidade, ativações digitais e placas de LED).

### Principais Funcionalidades

* **Painel Executivo / Dashboard (`/`)**: Visão consolidada de receita total sob gestão (R$), parceiros ativos, taxa de cumprimento de entregas e alertas de contrapartidas atrasadas. Acompanha gráficos interativos de distribuição de receita por cota e status de entregáveis com Recharts.
* **Gestão de Patrocinadores (`/sponsors`)**: Cadastro, categorização por nível de cota (Master, Naming Rights, Ouro, Prata, Bronze), dados de contato institucional e histórico.
* **Controle de Contratos (`/contracts`)**: Gestão de valores contratados, vigências precisas (com correção de fuso horário UTC), status contratual (*Ativo*, *Renovação*, *Encerrado*) e vínculos com as marcas parceiras.
* **Monitoramento de Contrapartidas (`/deliverables`)**: Controle operacional de entregas acordadas por tipo (Digital, Estádio/Matchday, Hospitalidade, Ativação de Marca), prazos de vencimento, status e links diretos para comprovantes de execução.

---

## 🏛️ Arquitetura e Engenharia de Software

O sistema adota a arquitetura modular e orientada a servidor do **Next.js App Router**, combinada com banco relacional nativo em nuvem com pool de conexões sob demanda:

```text
sponsorhub-spfc/
├── prisma/
│   └── schema.prisma         # Modelagem relacional e tipos de dados
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Shell global, tipografia Sofia Sans e Navbar SPFC
│   │   ├── page.tsx          # Dashboard executivo com renderização dinâmica
│   │   ├── sponsors/         # Gestão e listagem de patrocinadores
│   │   ├── contracts/        # Monitoramento de contratos comerciais
│   │   └── deliverables/     # Controle operacional de contrapartidas
│   ├── components/           # Componentes reutilizáveis de interface e gráficos
│   │   ├── Navbar.tsx        # Navegação institucional com rotas ativas
│   │   ├── charts/           # Gráficos interativos (Recharts)
│   │   └── actions/          # Modais de edição e exclusão
│   └── lib/
│       └── prisma.ts         # Singleton do Prisma Client para Serverless
├── public/                   # Identidade visual oficial e escudo SPFC
├── package.json              # Dependências e scripts de automação de build
└── next.config.ts            # Configurações de compilação Turbopack
```

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
* **Node.js**: versão 20.x ou superior
* **npm**, **pnpm** ou **yarn**
* Instância do **PostgreSQL** (local ou [Neon Serverless](https://neon.tech/))

### 2. Clonar o Repositório e Instalar Dependências

```bash
git clone https://github.com/flopesds/sponsorhub-spfc.git
cd sponsorhub-spfc
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com a string de conexão do PostgreSQL:

```env
DATABASE_URL="postgresql://usuario:senha@ep-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### 4. Sincronizar o Banco de Dados

```bash
npx prisma db push
```

### 5. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🛠️ Scripts Disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor de desenvolvimento com Turbopack. |
| `npm run build` | Executa o `prisma generate` e compila a aplicação para produção. |
| `npm run start` | Inicia o servidor Next.js em modo de produção. |
| `npm run lint` | Executa a verificação estática de código com Next.js ESLint. |

---

## 🎨 Identidade Visual Institucional

A aplicação segue a identidade oficial do **São Paulo Futebol Clube**:
* **Vermelho Fibra**: `#D71920`
* **Preto Tradição**: `#000000` / `#0A0D10` / `#0E1216`
* **Branco**: `#FFFFFF`
* **Cinza Valentim**: `#48535A` / `#283038`
* **Tipografia Oficial**: Sofia Sans (Google Fonts)

---

## 📄 Licença

Projeto desenvolvido para fins de gestão comercial e institucional. Direitos de marca e identidade reservados ao **São Paulo Futebol Clube** © 2026.
