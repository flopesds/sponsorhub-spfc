import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { RevenueByCotaChart } from "@/components/charts/RevenueByCotaChart";
import { DeliverableStatusChart } from "@/components/charts/DeliverableStatusChart";
import {
  DollarSign,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  ExternalLink,
  Plus,
  TrendingUp,
} from "lucide-react";

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "Dashboard Executivo | SponsorHub SPFC",
  description:
    "Painel consolidado de inteligência e performance comercial do São Paulo FC.",
};

function formatarData(date: Date | string) {
  return new Date(date).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

export default async function DashboardPage() {
  const [contracts, sponsors, deliverables] = await Promise.all([
    prisma.contract.findMany({
      include: {
        sponsor: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.sponsor.findMany({
      include: {
        contracts: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.deliverable.findMany({
      include: {
        contract: {
          include: {
            sponsor: true,
          },
        },
      },
      orderBy: { prazo: "asc" },
    }),
  ]);

  // 1. Receita Total sob Gestão (Soma dos contratos ativos)
  const activeContracts = contracts.filter((c) => c.status === "ATIVO");
  const renewingContracts = contracts.filter((c) => c.status === "RENOVAÇÃO");
  const totalReceitaAtiva = activeContracts.reduce((acc, c) => acc + c.valor, 0);
  const totalReceitaGeral = contracts.reduce((acc, c) => acc + c.valor, 0);

  // 2. Total de Patrocinadores Ativos (marcas que possuem contratos ATIVO ou RENOVAÇÃO)
  const activeSponsorsCount = sponsors.filter((s) =>
    s.contracts.some((c) => c.status === "ATIVO" || c.status === "RENOVAÇÃO")
  ).length;

  // 3. Taxa de Cumprimento de Contrapartidas (% entregues vs total)
  const entreguesCount = deliverables.filter((d) => d.status === "ENTREGUE").length;
  const emAndamentoCount = deliverables.filter(
    (d) => d.status === "EM_ANDAMENTO"
  ).length;
  const pendentesCount = deliverables.filter((d) => d.status === "PENDENTE").length;
  const atrasadasCount = deliverables.filter((d) => d.status === "ATRASADO").length;

  const taxaCumprimento =
    deliverables.length > 0
      ? Math.round((entreguesCount / deliverables.length) * 100)
      : 0;

  // 4. Preparação de Dados para o Gráfico de Receita por Cota
  const cotaAgg: Record<string, { valor: number; count: number }> = {};
  contracts.forEach((c) => {
    const cota = c.sponsor?.nivelCota || "Outros";
    if (!cotaAgg[cota]) {
      cotaAgg[cota] = { valor: 0, count: 0 };
    }
    cotaAgg[cota].valor += c.valor;
    cotaAgg[cota].count += 1;
  });

  const cotaOrder = ["Master", "Naming Rights", "Ouro", "Prata", "Bronze", "Outros"];
  const revenueByCotaData = Object.entries(cotaAgg)
    .sort(([a], [b]) => {
      const idxA = cotaOrder.indexOf(a);
      const idxB = cotaOrder.indexOf(b);
      return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
    })
    .map(([cota, { valor, count }]) => ({
      cota,
      valor,
      count,
      formattedValor: `R$ ${(valor / 1_000_000).toFixed(1)}M`,
    }));

  // 5. Preparação de Dados para o Gráfico de Rosca de Status
  const statusChartData = [
    { name: "Entregue", value: entreguesCount, color: "#10B981" },
    { name: "Em Andamento", value: emAndamentoCount, color: "#3B82F6" },
    { name: "Pendente", value: pendentesCount, color: "#F59E0B" },
    { name: "Atrasado", value: atrasadasCount, color: "#EF4444" },
  ].filter((item) => item.value > 0);

  // 6. Próximas 5 Contrapartidas com prazo mais próximo
  const proximaEntregas = deliverables
    .filter((d) => d.status !== "ENTREGUE")
    .slice(0, 5);
  const listToShow =
    proximaEntregas.length > 0 ? proximaEntregas : deliverables.slice(0, 5);

  return (
    <div
      style={{
        minHeight: "100%",
        backgroundColor: "#0A0D10",
        color: "#F3F4F6",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "32px 24px 60px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        {/* Banner de Boas-vindas e Ações Rápidas */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            borderBottom: "1px solid #1E2328",
            paddingBottom: "24px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <div
                style={{
                  width: "4px",
                  height: "18px",
                  backgroundColor: "#D71920",
                  borderRadius: "2px",
                }}
              />
              <h1
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  color: "#FFFFFF",
                  margin: 0,
                }}
              >
                Dashboard Executivo de Patrocínios
              </h1>
            </div>
            <p style={{ fontSize: "13px", color: "#8A9297", margin: 0 }}>
              Visão estratégica consolidada de contratos, parceiros comerciais e status de entregáveis.
            </p>
          </div>

          {/* Atalhos Rápidos */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <Link
              href="/sponsors"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "#12161B",
                border: "1px solid #283038",
                borderRadius: "6px",
                padding: "8px 14px",
                color: "#E5E7EB",
                fontSize: "12px",
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.15s",
              }}
            >
              <Plus size={14} color="#8A9297" />
              <span>Patrocinador</span>
            </Link>
            <Link
              href="/contracts"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "#12161B",
                border: "1px solid #283038",
                borderRadius: "6px",
                padding: "8px 14px",
                color: "#E5E7EB",
                fontSize: "12px",
                fontWeight: 600,
                textDecoration: "none",
                transition: "all 0.15s",
              }}
            >
              <Plus size={14} color="#8A9297" />
              <span>Contrato</span>
            </Link>
            <Link
              href="/deliverables"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "#D71920",
                borderRadius: "6px",
                padding: "8px 14px",
                color: "#FFFFFF",
                fontSize: "12px",
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 2px 8px rgba(215, 25, 32, 0.35)",
              }}
            >
              <Plus size={14} color="#FFFFFF" />
              <span>Contrapartida</span>
            </Link>
          </div>
        </div>

        {/* 4 Cards de Indicadores Consolidados (KPIs) */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "16px",
          }}
        >
          {/* KPI 1: Receita Total sob Gestão */}
          <div
            style={{
              backgroundColor: "#12161B",
              border: "1px solid #1E2328",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                backgroundColor: "#D71920",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#8A9297",
                  letterSpacing: "0.5px",
                }}
              >
                Receita Total sob Gestão
              </span>
              <div
                style={{
                  backgroundColor: "rgba(215, 25, 32, 0.15)",
                  padding: "6px",
                  borderRadius: "6px",
                  display: "flex",
                }}
              >
                <DollarSign size={16} color="#D71920" />
              </div>
            </div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#FFFFFF",
                fontFamily: "monospace",
                letterSpacing: "-0.5px",
              }}
            >
              R$ {totalReceitaAtiva.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <div style={{ fontSize: "11px", color: "#8A9297", display: "flex", alignItems: "center", gap: "6px" }}>
              <TrendingUp size={12} color="#10B981" />
              <span>
                {activeContracts.length} contratos ativos
                {renewingContracts.length > 0 && ` • ${renewingContracts.length} em renovação`}
              </span>
            </div>
          </div>

          {/* KPI 2: Total de Patrocinadores Ativos */}
          <div
            style={{
              backgroundColor: "#12161B",
              border: "1px solid #1E2328",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                backgroundColor: "#FFFFFF",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#8A9297",
                  letterSpacing: "0.5px",
                }}
              >
                Patrocinadores Ativos
              </span>
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  padding: "6px",
                  borderRadius: "6px",
                  display: "flex",
                }}
              >
                <Building2 size={16} color="#FFFFFF" />
              </div>
            </div>
            <div style={{ fontSize: "24px", fontWeight: 800, color: "#FFFFFF" }}>
              {activeSponsorsCount}
            </div>
            <div style={{ fontSize: "11px", color: "#8A9297" }}>
              de {sponsors.length} {sponsors.length === 1 ? "marca cadastrada" : "marcas cadastradas"} no total
            </div>
          </div>

          {/* KPI 3: Taxa de Cumprimento de Contrapartidas */}
          <div
            style={{
              backgroundColor: "#12161B",
              border: "1px solid #1E2328",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                backgroundColor: "#10B981",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#10B981",
                  letterSpacing: "0.5px",
                }}
              >
                Taxa de Cumprimento
              </span>
              <div
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  padding: "6px",
                  borderRadius: "6px",
                  display: "flex",
                }}
              >
                <CheckCircle2 size={16} color="#10B981" />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span style={{ fontSize: "24px", fontWeight: 800, color: "#10B981" }}>
                {taxaCumprimento}%
              </span>
              <span style={{ fontSize: "12px", color: "#8A9297" }}>das entregas</span>
            </div>
            {/* Barra de Progresso */}
            <div
              style={{
                width: "100%",
                height: "6px",
                backgroundColor: "#1E2328",
                borderRadius: "3px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${taxaCumprimento}%`,
                  height: "100%",
                  backgroundColor: "#10B981",
                  borderRadius: "3px",
                  transition: "width 0.5s ease-in-out",
                }}
              />
            </div>
            <div style={{ fontSize: "11px", color: "#8A9297" }}>
              {entreguesCount} de {deliverables.length} contrapartidas validadas
            </div>
          </div>

          {/* KPI 4: Alertas de Entregas Críticas/Atrasadas */}
          <div
            style={{
              backgroundColor: atrasadasCount > 0 ? "rgba(215, 25, 32, 0.08)" : "#12161B",
              border: atrasadasCount > 0 ? "1px solid rgba(215, 25, 32, 0.4)" : "1px solid #1E2328",
              borderRadius: "12px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                backgroundColor: atrasadasCount > 0 ? "#EF4444" : "#48535A",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: atrasadasCount > 0 ? "#EF4444" : "#8A9297",
                  letterSpacing: "0.5px",
                }}
              >
                Entregas Críticas / Atrasadas
              </span>
              <div
                style={{
                  backgroundColor: atrasadasCount > 0 ? "rgba(239, 68, 68, 0.2)" : "#1A2026",
                  padding: "6px",
                  borderRadius: "6px",
                  display: "flex",
                }}
              >
                <AlertTriangle size={16} color={atrasadasCount > 0 ? "#EF4444" : "#8A9297"} />
              </div>
            </div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: atrasadasCount > 0 ? "#EF4444" : "#FFFFFF",
              }}
            >
              {atrasadasCount}
            </div>
            <div style={{ fontSize: "11px", color: atrasadasCount > 0 ? "#FCA5A5" : "#6B7280" }}>
              {atrasadasCount === 0
                ? "Nenhuma entrega em atraso no momento."
                : "Demandas atrasadas necessitam de atenção operacional imediata."}
            </div>
          </div>
        </section>

        {/* 2 Gráficos Analíticos com Recharts */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
            gap: "24px",
          }}
        >
          {/* Gráfico 1: Barras - Distribuição de Receita por Cota */}
          <div
            style={{
              backgroundColor: "#12161B",
              border: "1px solid #1E2328",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "4px",
                      height: "16px",
                      backgroundColor: "#D71920",
                      borderRadius: "2px",
                    }}
                  />
                  <h2
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.6px",
                      color: "#FFFFFF",
                      margin: 0,
                    }}
                  >
                    Receita por Cota Contratual
                  </h2>
                </div>
                <p style={{ fontSize: "12px", color: "#8A9297", margin: "4px 0 0 0" }}>
                  Valores financeiros consolidados por categoria de patrocínio
                </p>
              </div>
              <Link
                href="/contracts"
                style={{
                  fontSize: "11px",
                  color: "#8A9297",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span>Ver contratos</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            <RevenueByCotaChart data={revenueByCotaData} />
          </div>

          {/* Gráfico 2: Rosca - Status das Contrapartidas */}
          <div
            style={{
              backgroundColor: "#12161B",
              border: "1px solid #1E2328",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      width: "4px",
                      height: "16px",
                      backgroundColor: "#FFFFFF",
                      borderRadius: "2px",
                    }}
                  />
                  <h2
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.6px",
                      color: "#FFFFFF",
                      margin: 0,
                    }}
                  >
                    Status das Contrapartidas
                  </h2>
                </div>
                <p style={{ fontSize: "12px", color: "#8A9297", margin: "4px 0 0 0" }}>
                  Cumprimento operacional e distribuição de entregáveis
                </p>
              </div>
              <Link
                href="/deliverables"
                style={{
                  fontSize: "11px",
                  color: "#8A9297",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span>Ver todas</span>
                <ArrowRight size={12} />
              </Link>
            </div>

            <DeliverableStatusChart data={statusChartData} />
          </div>
        </section>

        {/* Lista Rápida: Próximas 5 Contrapartidas a Vencer */}
        <section
          style={{
            backgroundColor: "#12161B",
            border: "1px solid #1E2328",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              padding: "18px 24px",
              borderBottom: "1px solid #1E2328",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Clock size={16} color="#D71920" />
                <h2
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    color: "#FFFFFF",
                    margin: 0,
                  }}
                >
                  Próximas Contrapartidas a Vencer
                </h2>
              </div>
              <p style={{ fontSize: "12px", color: "#8A9297", margin: "2px 0 0 0" }}>
                Entregas com prazo mais próximo que exigem execução ou comprovação
              </p>
            </div>

            <Link
              href="/deliverables"
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#D71920",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>Gerenciar todas as entregas</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
                fontSize: "13px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#0E1216", borderBottom: "1px solid #1E2328" }}>
                  <th style={{ padding: "14px 24px", color: "#8A9297", fontWeight: 700, textTransform: "uppercase", fontSize: "11px" }}>
                    Patrocinador / Cota
                  </th>
                  <th style={{ padding: "14px 24px", color: "#8A9297", fontWeight: 700, textTransform: "uppercase", fontSize: "11px" }}>
                    Tipo
                  </th>
                  <th style={{ padding: "14px 24px", color: "#8A9297", fontWeight: 700, textTransform: "uppercase", fontSize: "11px" }}>
                    Descrição da Entrega
                  </th>
                  <th style={{ padding: "14px 24px", color: "#8A9297", fontWeight: 700, textTransform: "uppercase", fontSize: "11px" }}>
                    Prazo
                  </th>
                  <th style={{ padding: "14px 24px", color: "#8A9297", fontWeight: 700, textTransform: "uppercase", fontSize: "11px" }}>
                    Status
                  </th>
                  <th style={{ padding: "14px 24px", color: "#8A9297", fontWeight: 700, textTransform: "uppercase", fontSize: "11px" }}>
                    Comprovante
                  </th>
                </tr>
              </thead>
              <tbody>
                {listToShow.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding: "36px",
                        textAlign: "center",
                        color: "#6B7280",
                      }}
                    >
                      Nenhuma contrapartida pendente registrada. Acesse o módulo de{" "}
                      <Link href="/deliverables" style={{ color: "#D71920", textDecoration: "underline" }}>
                        Contrapartidas
                      </Link>{" "}
                      para cadastrar demandas.
                    </td>
                  </tr>
                ) : (
                  listToShow.map((item) => {
                    const statusConfig = {
                      PENDENTE: {
                        bg: "rgba(245, 158, 11, 0.15)",
                        text: "#F59E0B",
                        border: "rgba(245, 158, 11, 0.3)",
                        label: "PENDENTE",
                      },
                      EM_ANDAMENTO: {
                        bg: "rgba(59, 130, 246, 0.15)",
                        text: "#60A5FA",
                        border: "rgba(59, 130, 246, 0.3)",
                        label: "EM ANDAMENTO",
                      },
                      ENTREGUE: {
                        bg: "rgba(16, 185, 129, 0.15)",
                        text: "#10B981",
                        border: "rgba(16, 185, 129, 0.3)",
                        label: "ENTREGUE",
                      },
                      ATRASADO: {
                        bg: "rgba(215, 25, 32, 0.15)",
                        text: "#EF4444",
                        border: "rgba(215, 25, 32, 0.3)",
                        label: "ATRASADO",
                      },
                    }[item.status] || {
                      bg: "rgba(107, 114, 128, 0.15)",
                      text: "#9CA3AF",
                      border: "rgba(107, 114, 128, 0.3)",
                      label: item.status,
                    };

                    return (
                      <tr key={item.id} style={{ borderBottom: "1px solid #1A1F24" }}>
                        {/* Patrocinador e Cota */}
                        <td style={{ padding: "16px 24px" }}>
                          <div style={{ fontWeight: 700, color: "#FFFFFF" }}>
                            {item.contract.sponsor.nome}
                          </div>
                          <span
                            style={{
                              display: "inline-block",
                              marginTop: "4px",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "10px",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              backgroundColor:
                                item.contract.sponsor.nivelCota === "Master" ||
                                item.contract.sponsor.nivelCota === "Naming Rights"
                                  ? "rgba(215, 25, 32, 0.15)"
                                  : "#1A2026",
                              color:
                                item.contract.sponsor.nivelCota === "Master" ||
                                item.contract.sponsor.nivelCota === "Naming Rights"
                                  ? "#D71920"
                                  : "#8A9297",
                              border:
                                item.contract.sponsor.nivelCota === "Master" ||
                                item.contract.sponsor.nivelCota === "Naming Rights"
                                  ? "1px solid rgba(215, 25, 32, 0.3)"
                                  : "1px solid #283038",
                            }}
                          >
                            {item.contract.sponsor.nivelCota}
                          </span>
                        </td>

                        {/* Tipo */}
                        <td style={{ padding: "16px 24px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "3px 8px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              fontWeight: 600,
                              backgroundColor: "#161B22",
                              color: "#E5E7EB",
                              border: "1px solid #283038",
                            }}
                          >
                            {item.tipo}
                          </span>
                        </td>

                        {/* Descrição */}
                        <td style={{ padding: "16px 24px", color: "#F3F4F6", maxWidth: "340px" }}>
                          <div style={{ fontWeight: 500 }}>{item.descricao}</div>
                        </td>

                        {/* Prazo */}
                        <td style={{ padding: "16px 24px", color: "#9CA3AF", fontSize: "12px", whiteSpace: "nowrap" }}>
                          {formatarData(item.prazo)}
                        </td>

                        {/* Status */}
                        <td style={{ padding: "16px 24px", whiteSpace: "nowrap" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "3px 8px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              backgroundColor: statusConfig.bg,
                              color: statusConfig.text,
                              border: `1px solid ${statusConfig.border}`,
                            }}
                          >
                            {statusConfig.label}
                          </span>
                        </td>

                        {/* Comprovante */}
                        <td style={{ padding: "16px 24px" }}>
                          {item.comprovanteUrl ? (
                            <a
                              href={item.comprovanteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                color: "#60A5FA",
                                fontSize: "12px",
                                textDecoration: "none",
                                fontWeight: 500,
                              }}
                            >
                              <span>Ver link</span>
                              <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span style={{ color: "#4B5563", fontSize: "12px" }}>—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
