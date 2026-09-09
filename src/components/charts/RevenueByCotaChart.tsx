"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

type CotaRevenue = {
  cota: string;
  valor: number;
  formattedValor: string;
  count: number;
};

const COTA_COLORS: Record<string, string> = {
  Master: "#D71920", // SPFC Vermelho Fibra
  "Naming Rights": "#B91C1C",
  Ouro: "#F59E0B",
  Prata: "#9CA3AF",
  Bronze: "#B45309",
  Outros: "#48535A",
};

export function RevenueByCotaChart({ data }: { data: CotaRevenue[] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        style={{
          height: 280,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#8A9297",
          fontSize: "12px",
        }}
      >
        Carregando gráfico de receitas...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        style={{
          height: 280,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#8A9297",
          fontSize: "13px",
          gap: "8px",
        }}
      >
        <span>Nenhum contrato ativo para gerar distribuição.</span>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1E2328" vertical={false} />
          <XAxis
            dataKey="cota"
            stroke="#8A9297"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: "#283038" }}
            interval={0}
            dy={8}
          />
          <YAxis
            stroke="#8A9297"
            fontSize={10}
            tickLine={false}
            axisLine={{ stroke: "#283038" }}
            tickFormatter={(val) => {
              if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(0)}M`;
              if (val >= 1_000) return `${(val / 1_000).toFixed(0)}k`;
              return `${val}`;
            }}
          />
          <Tooltip
            cursor={{ fill: "rgba(255, 255, 255, 0.03)" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as CotaRevenue;
                return (
                  <div
                    style={{
                      backgroundColor: "#0E1216",
                      border: "1px solid #283038",
                      borderRadius: "8px",
                      padding: "10px 14px",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
                    }}
                  >
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#FFFFFF", marginBottom: "4px" }}>
                      Cota: {item.cota}
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#D71920", fontFamily: "monospace" }}>
                      R$ {item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </div>
                    <div style={{ fontSize: "10px", color: "#8A9297", marginTop: "2px" }}>
                      {item.count} {item.count === 1 ? "contrato" : "contratos"}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => {
              const color = COTA_COLORS[entry.cota] || "#D71920";
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
