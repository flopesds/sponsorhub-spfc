"use client";

import { useState } from "react";
import { updateDeliverable, deleteDeliverable } from "@/app/actions/deliverables";
import { Pencil, Trash2, X, ExternalLink } from "lucide-react";

type ContractOption = {
  id: string;
  sponsor: {
    nome: string;
    nivelCota: string;
  };
};

type DeliverableItem = {
  id: string;
  contractId: string;
  descricao: string;
  tipo: string;
  prazo: Date;
  status: string;
  comprovanteUrl: string | null;
  contract: {
    id: string;
    sponsor: {
      nome: string;
      categoria: string;
      nivelCota: string;
    };
  };
};

export function DeliverableActions({
  deliverable,
  contracts,
}: {
  deliverable: DeliverableItem;
  contracts: ContractOption[];
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Formata a data para o formato aceito por <input type="date" /> (YYYY-MM-DD)
  const defaultPrazo = new Date(deliverable.prazo).toISOString().split("T")[0];

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "flex-end" }}>
        {/* Botão de Editar */}
        <button
          type="button"
          onClick={() => setIsEditOpen(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            backgroundColor: "#1A2026",
            border: "1px solid #283038",
            borderRadius: "6px",
            padding: "6px 10px",
            color: "#E5E7EB",
            fontSize: "11px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          title="Editar Contrapartida"
        >
          <Pencil size={12} color="#8A9297" />
          <span>Editar</span>
        </button>

        {/* Botão de Excluir */}
        <form
          action={deleteDeliverable}
          onSubmit={(e) => {
            if (!confirm(`Tem certeza que deseja excluir a entrega "${deliverable.descricao}"?`)) {
              e.preventDefault();
            }
          }}
          style={{ margin: 0 }}
        >
          <input type="hidden" name="id" value={deliverable.id} />
          <button
            type="submit"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              backgroundColor: "rgba(215, 25, 32, 0.1)",
              border: "1px solid rgba(215, 25, 32, 0.3)",
              borderRadius: "6px",
              padding: "6px 10px",
              color: "#EF4444",
              fontSize: "11px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            title="Excluir Contrapartida"
          >
            <Trash2 size={12} color="#D71920" />
            <span>Excluir</span>
          </button>
        </form>
      </div>

      {/* Modal de Edição */}
      {isEditOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#12161B",
              border: "1px solid #283038",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "540px",
              padding: "24px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
            }}
          >
            {/* Cabeçalho do Modal */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
                borderBottom: "1px solid #1E2328",
                paddingBottom: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "4px", height: "16px", backgroundColor: "#D71920", borderRadius: "2px" }} />
                <h3 style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase", color: "#FFFFFF", margin: 0 }}>
                  Editar Contrapartida
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#8A9297",
                  cursor: "pointer",
                  padding: "4px",
                  display: "flex",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Formulário */}
            <form
              action={async (formData) => {
                await updateDeliverable(formData);
                setIsEditOpen(false);
              }}
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <input type="hidden" name="id" value={deliverable.id} />

              {/* Contrato / Patrocinador */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8A9297", marginBottom: "4px" }}>
                  Contrato / Patrocinador *
                </label>
                <select
                  name="contractId"
                  defaultValue={deliverable.contractId}
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "#0A0D10",
                    border: "1px solid #283038",
                    borderRadius: "6px",
                    padding: "10px",
                    color: "#FFF",
                    fontSize: "13px",
                    outline: "none",
                  }}
                >
                  {contracts.map((c) => (
                    <option key={c.id} value={c.id} style={{ backgroundColor: "#12161B" }}>
                      {c.sponsor.nome} ({c.sponsor.nivelCota})
                    </option>
                  ))}
                </select>
              </div>

              {/* Descrição */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8A9297", marginBottom: "4px" }}>
                  Descrição da Entrega *
                </label>
                <input
                  name="descricao"
                  type="text"
                  defaultValue={deliverable.descricao}
                  required
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "#0A0D10",
                    border: "1px solid #283038",
                    borderRadius: "6px",
                    padding: "10px",
                    color: "#FFF",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </div>

              {/* Tipo e Status */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8A9297", marginBottom: "4px" }}>
                    Tipo *
                  </label>
                  <select
                    name="tipo"
                    defaultValue={deliverable.tipo}
                    required
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      backgroundColor: "#0A0D10",
                      border: "1px solid #283038",
                      borderRadius: "6px",
                      padding: "10px",
                      color: "#FFF",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  >
                    <option value="Digital" style={{ backgroundColor: "#12161B" }}>Digital</option>
                    <option value="Estádio/Matchday" style={{ backgroundColor: "#12161B" }}>Estádio/Matchday</option>
                    <option value="Hospitalidade" style={{ backgroundColor: "#12161B" }}>Hospitalidade</option>
                    <option value="Ativação de Marca" style={{ backgroundColor: "#12161B" }}>Ativação de Marca</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8A9297", marginBottom: "4px" }}>
                    Status *
                  </label>
                  <select
                    name="status"
                    defaultValue={deliverable.status}
                    required
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      backgroundColor: "#0A0D10",
                      border: "1px solid #283038",
                      borderRadius: "6px",
                      padding: "10px",
                      color: "#FFF",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  >
                    <option value="PENDENTE" style={{ backgroundColor: "#12161B" }}>PENDENTE</option>
                    <option value="EM_ANDAMENTO" style={{ backgroundColor: "#12161B" }}>EM_ANDAMENTO</option>
                    <option value="ENTREGUE" style={{ backgroundColor: "#12161B" }}>ENTREGUE</option>
                    <option value="ATRASADO" style={{ backgroundColor: "#12161B" }}>ATRASADO</option>
                  </select>
                </div>
              </div>

              {/* Prazo e Comprovante */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8A9297", marginBottom: "4px" }}>
                    Prazo de Entrega *
                  </label>
                  <input
                    name="prazo"
                    type="date"
                    defaultValue={defaultPrazo}
                    required
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      backgroundColor: "#0A0D10",
                      border: "1px solid #283038",
                      borderRadius: "6px",
                      padding: "10px",
                      color: "#FFF",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8A9297", marginBottom: "4px" }}>
                    URL de Comprovante (Opcional)
                  </label>
                  <input
                    name="comprovanteUrl"
                    type="url"
                    placeholder="https://..."
                    defaultValue={deliverable.comprovanteUrl || ""}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      backgroundColor: "#0A0D10",
                      border: "1px solid #283038",
                      borderRadius: "6px",
                      padding: "10px",
                      color: "#FFF",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              {/* Botões do Modal */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  style={{
                    backgroundColor: "transparent",
                    border: "1px solid #283038",
                    borderRadius: "6px",
                    padding: "10px 16px",
                    color: "#9CA3AF",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#D71920",
                    border: "none",
                    borderRadius: "6px",
                    padding: "10px 20px",
                    color: "#FFFFFF",
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    cursor: "pointer",
                  }}
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
