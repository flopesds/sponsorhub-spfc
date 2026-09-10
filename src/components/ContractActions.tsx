"use client";

import { useState } from "react";
import { updateContract, deleteContract } from "@/app/actions/contracts";
import { Pencil, Trash2, X } from "lucide-react";

type SponsorOption = {
  id: string;
  nome: string;
  nivelCota: string;
};

type ContractItem = {
  id: string;
  sponsorId: string;
  valor: number;
  dataInicio: Date;
  dataFim: Date;
  status: string;
  sponsor: {
    id: string;
    nome: string;
    categoria: string;
    nivelCota: string;
  };
};

export function ContractActions({
  contract,
  sponsors,
}: {
  contract: ContractItem;
  sponsors: SponsorOption[];
}) {
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Formata datas para o formato aceito por <input type="date" /> (YYYY-MM-DD)
  const defaultInicio = new Date(contract.dataInicio).toISOString().split("T")[0];
  const defaultFim = new Date(contract.dataFim).toISOString().split("T")[0];

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "flex-end" }}>
        {/* Botão de Editar */}
        <button
          type="button"
          onClick={() => !isDemo && setIsEditOpen(true)}
          disabled={isDemo}
          className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
            isDemo
              ? 'bg-neutral-900 text-neutral-600 border border-neutral-800 cursor-not-allowed opacity-50'
              : 'border border-neutral-700 text-neutral-300 hover:bg-neutral-800'
          }`}
          title={isDemo ? "Modo demonstração: edição bloqueada" : "Editar Contrato"}
        >
          <Pencil size={12} />
          <span>Editar</span>
        </button>

        {/* Botão de Excluir */}
        <form
          action={deleteContract}
          onSubmit={(e) => {
            if (isDemo) {
              e.preventDefault();
              return;
            }
            if (!confirm(`Tem certeza que deseja excluir este contrato com "${contract.sponsor.nome}"?`)) {
              e.preventDefault();
            }
          }}
          style={{ margin: 0 }}
        >
          <input type="hidden" name="id" value={contract.id} />
          <button
            type="submit"
            disabled={isDemo}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
              isDemo
                ? 'bg-neutral-900 text-neutral-600 border border-neutral-800 cursor-not-allowed opacity-50'
                : 'border border-red-900/60 text-red-400 hover:bg-red-950/40'
            }`}
            title={isDemo ? "Modo demonstração: exclusão bloqueada" : "Excluir Contrato"}
          >
            <Trash2 size={12} />
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
              maxWidth: "520px",
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
                  Editar Contrato
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
                await updateContract(formData);
                setIsEditOpen(false);
              }}
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <input type="hidden" name="id" value={contract.id} />

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8A9297", marginBottom: "4px" }}>
                  Patrocinador *
                </label>
                <select
                  name="sponsorId"
                  defaultValue={contract.sponsorId}
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
                  {sponsors.map((s) => (
                    <option key={s.id} value={s.id} style={{ backgroundColor: "#12161B" }}>
                      {s.nome} ({s.nivelCota})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8A9297", marginBottom: "4px" }}>
                    Valor Total (R$) *
                  </label>
                  <input
                    name="valor"
                    type="number"
                    step="0.01"
                    defaultValue={contract.valor}
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
                    Status do Contrato *
                  </label>
                  <select
                    name="status"
                    defaultValue={contract.status}
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
                    <option value="ATIVO" style={{ backgroundColor: "#12161B" }}>ATIVO</option>
                    <option value="RENOVAÇÃO" style={{ backgroundColor: "#12161B" }}>RENOVAÇÃO</option>
                    <option value="ENCERRADO" style={{ backgroundColor: "#12161B" }}>ENCERRADO</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "#8A9297", marginBottom: "4px" }}>
                    Data de Início *
                  </label>
                  <input
                    name="dataInicio"
                    type="date"
                    defaultValue={defaultInicio}
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
                    Data de Fim *
                  </label>
                  <input
                    name="dataFim"
                    type="date"
                    defaultValue={defaultFim}
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
