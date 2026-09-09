"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

type StatusData = {
  name: string;
  value: number;
  color: string;
};

export function DeliverableStatusChart({ data }: { data: StatusData[] }) {
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
        Carregando status de contrapartidas...
      </div>
    );
  }

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  if (total === 0) {
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
        <span>Nenhuma contrapartida registrada ainda.</span>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 280, position: "relative" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="#12161B"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as StatusData;
                const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
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
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 700,
                        color: item.color,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: item.color,
                        }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#FFFFFF",
                        marginTop: "4px",
                      }}
                    >
                      {item.value} {item.value === 1 ? "entrega" : "entregas"} ({percentage}%)
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            iconSize={8}
            formatter={(value) => {
              const item = data.find((d) => d.name === value);
              return (
                <span style={{ color: "#E5E7EB", fontSize: "11px", fontWeight: 600, marginRight: "12px" }}>
                  {value}: <span style={{ color: "#8A9297" }}>{item?.value || 0}</span>
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
