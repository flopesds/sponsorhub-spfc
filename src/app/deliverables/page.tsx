export const dynamic = 'force-dynamic';

import { getDeliverables, createDeliverable } from '@/app/actions/deliverables'
import { getContracts } from '@/app/actions/contracts'
import { DeliverableActions } from '@/components/DeliverableActions'
import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink, CheckCircle2, Clock, AlertTriangle, PlayCircle } from 'lucide-react'

export const metadata = {
  title: 'Gestão de Contrapartidas | SponsorHub SPFC',
  description: 'Acompanhamento de entregas, ativações e contrapartidas contratuais do São Paulo FC.',
}

function formatarData(date: Date | string) {
  return new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
}

export default async function DeliverablesPage() {
  const [deliverables, contracts] = await Promise.all([
    getDeliverables(),
    getContracts(),
  ])

  // Métricas do painel
  const totalEntregas = deliverables.length
  const totalPendentes = deliverables.filter((d) => d.status === 'PENDENTE').length
  const totalEmAndamento = deliverables.filter((d) => d.status === 'EM_ANDAMENTO').length
  const totalEntregues = deliverables.filter((d) => d.status === 'ENTREGUE').length
  const totalAtrasadas = deliverables.filter((d) => d.status === 'ATRASADO').length

  return (
    <div style={{ minHeight: '100%', backgroundColor: '#0A0D10', color: '#F3F4F6', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Painel de Métricas Rápidas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div style={{ backgroundColor: '#12161B', border: '1px solid #1E2328', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8A9297', letterSpacing: '0.5px' }}>
              Total de Contrapartidas
            </span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>
              {totalEntregas}
            </div>
            <span style={{ fontSize: '11px', color: '#6B7280' }}>Demandas e ativações registradas</span>
          </div>

          <div style={{ backgroundColor: '#12161B', border: '1px solid #1E2328', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#F59E0B', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="#F59E0B" /> Pendentes / Em Curso
            </span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#F59E0B' }}>
              {totalPendentes + totalEmAndamento}
            </div>
            <span style={{ fontSize: '11px', color: '#6B7280' }}>
              {totalPendentes} pendentes • {totalEmAndamento} em produção
            </span>
          </div>

          <div style={{ backgroundColor: '#12161B', border: '1px solid #1E2328', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#10B981', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} color="#10B981" /> Entregues
            </span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#10B981' }}>
              {totalEntregues}
            </div>
            <span style={{ fontSize: '11px', color: '#6B7280' }}>Contrapartidas realizadas e validadas</span>
          </div>

          <div style={{ backgroundColor: '#12161B', border: '1px solid #1E2328', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: totalAtrasadas > 0 ? '#EF4444' : '#8A9297', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={14} color={totalAtrasadas > 0 ? '#EF4444' : '#8A9297'} /> Atrasadas
            </span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: totalAtrasadas > 0 ? '#EF4444' : '#FFFFFF' }}>
              {totalAtrasadas}
            </div>
            <span style={{ fontSize: '11px', color: '#6B7280' }}>Necessitam atenção operacional imediata</span>
          </div>
        </div>

        {/* Card de Cadastro de Nova Contrapartida */}
        <section style={{ backgroundColor: '#12161B', border: '1px solid #1E2328', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '4px', height: '18px', backgroundColor: '#D71920', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#FFFFFF', margin: 0 }}>
              Nova Contrapartida Comercial
            </h2>
          </div>

          <form action={createDeliverable} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {/* Seleção de Contrato */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8A9297', marginBottom: '6px' }}>
                Contrato / Patrocinador *
              </label>
              <select
                name="contractId"
                required
                defaultValue=""
                style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#0A0D10', border: '1px solid #283038', borderRadius: '8px', padding: '12px', color: '#FFF', fontSize: '13px', outline: 'none' }}
              >
                <option value="" disabled style={{ backgroundColor: '#12161B' }}>
                  {contracts.length === 0 ? 'Nenhum contrato cadastrado' : 'Selecione o contrato associado'}
                </option>
                {contracts.map((c) => (
                  <option key={c.id} value={c.id} style={{ backgroundColor: '#12161B' }}>
                    {c.sponsor.nome} ({c.sponsor.nivelCota}) - Vigência: {formatarData(c.dataInicio)} a {formatarData(c.dataFim)} [{c.status}]
                  </option>
                ))}
              </select>
            </div>

            {/* Descrição da Entrega */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8A9297', marginBottom: '6px' }}>
                Descrição da Entrega *
              </label>
              <input
                name="descricao"
                type="text"
                placeholder="Ex: Placa de LED Linha de Fundo - 3min, Post Instagram Feed, Camarote Corporativo"
                required
                style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#0A0D10', border: '1px solid #283038', borderRadius: '8px', padding: '12px', color: '#FFF', fontSize: '13px', outline: 'none' }}
              />
            </div>

            {/* Tipo */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8A9297', marginBottom: '6px' }}>
                Tipo de Contrapartida *
              </label>
              <select
                name="tipo"
                required
                defaultValue="Digital"
                style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#0A0D10', border: '1px solid #283038', borderRadius: '8px', padding: '12px', color: '#FFF', fontSize: '13px', outline: 'none' }}
              >
                <option value="Digital" style={{ backgroundColor: '#12161B' }}>Digital</option>
                <option value="Estádio/Matchday" style={{ backgroundColor: '#12161B' }}>Estádio/Matchday</option>
                <option value="Hospitalidade" style={{ backgroundColor: '#12161B' }}>Hospitalidade</option>
                <option value="Ativação de Marca" style={{ backgroundColor: '#12161B' }}>Ativação de Marca</option>
              </select>
            </div>

            {/* Prazo de Entrega */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8A9297', marginBottom: '6px' }}>
                Prazo de Entrega *
              </label>
              <input
                name="prazo"
                type="date"
                required
                style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#0A0D10', border: '1px solid #283038', borderRadius: '8px', padding: '12px', color: '#FFF', fontSize: '13px', outline: 'none' }}
              />
            </div>

            {/* Status */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8A9297', marginBottom: '6px' }}>
                Status *
              </label>
              <select
                name="status"
                required
                defaultValue="PENDENTE"
                style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#0A0D10', border: '1px solid #283038', borderRadius: '8px', padding: '12px', color: '#FFF', fontSize: '13px', outline: 'none' }}
              >
                <option value="PENDENTE" style={{ backgroundColor: '#12161B' }}>PENDENTE</option>
                <option value="EM_ANDAMENTO" style={{ backgroundColor: '#12161B' }}>EM_ANDAMENTO</option>
                <option value="ENTREGUE" style={{ backgroundColor: '#12161B' }}>ENTREGUE</option>
                <option value="ATRASADO" style={{ backgroundColor: '#12161B' }}>ATRASADO</option>
              </select>
            </div>

            {/* URL de Comprovante */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8A9297', marginBottom: '6px' }}>
                URL de Comprovante (Opcional)
              </label>
              <input
                name="comprovanteUrl"
                type="url"
                placeholder="https://drive.google.com/... ou https://instagram.com/..."
                style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#0A0D10', border: '1px solid #283038', borderRadius: '8px', padding: '12px', color: '#FFF', fontSize: '13px', outline: 'none' }}
              />
            </div>

            {/* Botão de Submissão */}
            <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
              <button
                type="submit"
                disabled={contracts.length === 0}
                style={{
                  backgroundColor: contracts.length === 0 ? '#4B5563' : '#D71920',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: 700,
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  cursor: contracts.length === 0 ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                Cadastrar Contrapartida
              </button>
            </div>
          </form>
        </section>

        {/* Tabela de Listagem de Contrapartidas */}
        <section style={{ backgroundColor: '#12161B', border: '1px solid #1E2328', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E2328', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '4px', height: '18px', backgroundColor: '#FFFFFF', borderRadius: '2px' }} />
              <h2 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#FFFFFF', margin: 0 }}>
                Contrapartidas & Entregas Registradas
              </h2>
            </div>
            <span style={{ fontSize: '12px', color: '#8A9297', backgroundColor: '#1A2026', padding: '4px 10px', borderRadius: '20px', border: '1px solid #283038' }}>
              {deliverables.length} {deliverables.length === 1 ? 'entrega' : 'entregas'}
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#0E1216', borderBottom: '1px solid #1E2328' }}>
                  <th style={{ padding: '14px 24px', color: '#8A9297', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px' }}>Patrocinador / Cota</th>
                  <th style={{ padding: '14px 24px', color: '#8A9297', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px' }}>Tipo</th>
                  <th style={{ padding: '14px 24px', color: '#8A9297', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px' }}>Descrição da Entrega</th>
                  <th style={{ padding: '14px 24px', color: '#8A9297', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px' }}>Prazo</th>
                  <th style={{ padding: '14px 24px', color: '#8A9297', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px' }}>Status</th>
                  <th style={{ padding: '14px 24px', color: '#8A9297', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px' }}>Comprovante</th>
                  <th style={{ padding: '14px 24px', color: '#8A9297', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {deliverables.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: '#6B7280' }}>
                      Nenhuma contrapartida registrada até o momento.
                    </td>
                  </tr>
                ) : (
                  deliverables.map((item) => {
                    // Configuração de cores e estilos para status
                    const statusConfig = {
                      PENDENTE: {
                        bg: 'rgba(245, 158, 11, 0.15)',
                        text: '#F59E0B',
                        border: 'rgba(245, 158, 11, 0.3)',
                        label: 'PENDENTE',
                      },
                      EM_ANDAMENTO: {
                        bg: 'rgba(59, 130, 246, 0.15)',
                        text: '#60A5FA',
                        border: 'rgba(59, 130, 246, 0.3)',
                        label: 'EM ANDAMENTO',
                      },
                      ENTREGUE: {
                        bg: 'rgba(16, 185, 129, 0.15)',
                        text: '#10B981',
                        border: 'rgba(16, 185, 129, 0.3)',
                        label: 'ENTREGUE',
                      },
                      ATRASADO: {
                        bg: 'rgba(215, 25, 32, 0.15)',
                        text: '#EF4444',
                        border: 'rgba(215, 25, 32, 0.3)',
                        label: 'ATRASADO',
                      },
                    }[item.status] || {
                      bg: 'rgba(107, 114, 128, 0.15)',
                      text: '#9CA3AF',
                      border: 'rgba(107, 114, 128, 0.3)',
                      label: item.status,
                    }

                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid #1A1F24' }}>
                        {/* Patrocinador e Cota */}
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{item.contract.sponsor.nome}</div>
                          <span
                            style={{
                              display: 'inline-block',
                              marginTop: '4px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              backgroundColor:
                                item.contract.sponsor.nivelCota === 'Master' || item.contract.sponsor.nivelCota === 'Naming Rights'
                                  ? 'rgba(215, 25, 32, 0.15)'
                                  : '#1A2026',
                              color:
                                item.contract.sponsor.nivelCota === 'Master' || item.contract.sponsor.nivelCota === 'Naming Rights'
                                  ? '#D71920'
                                  : '#8A9297',
                              border:
                                item.contract.sponsor.nivelCota === 'Master' || item.contract.sponsor.nivelCota === 'Naming Rights'
                                  ? '1px solid rgba(215, 25, 32, 0.3)'
                                  : '1px solid #283038',
                            }}
                          >
                            {item.contract.sponsor.nivelCota}
                          </span>
                        </td>

                        {/* Tipo */}
                        <td style={{ padding: '16px 24px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                              backgroundColor: '#161B22',
                              color: '#E5E7EB',
                              border: '1px solid #283038',
                            }}
                          >
                            {item.tipo}
                          </span>
                        </td>

                        {/* Descrição */}
                        <td style={{ padding: '16px 24px', color: '#F3F4F6', maxWidth: '320px' }}>
                          <div style={{ fontWeight: 500 }}>{item.descricao}</div>
                        </td>

                        {/* Prazo */}
                        <td style={{ padding: '16px 24px', color: '#9CA3AF', fontSize: '12px', whiteSpace: 'nowrap' }}>
                          {formatarData(item.prazo)}
                        </td>

                        {/* Status */}
                        <td style={{ padding: '16px 24px', whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              backgroundColor: statusConfig.bg,
                              color: statusConfig.text,
                              border: `1px solid ${statusConfig.border}`,
                            }}
                          >
                            {statusConfig.label}
                          </span>
                        </td>

                        {/* Comprovante */}
                        <td style={{ padding: '16px 24px' }}>
                          {item.comprovanteUrl ? (
                            <a
                              href={item.comprovanteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                color: '#60A5FA',
                                fontSize: '12px',
                                textDecoration: 'none',
                                fontWeight: 500,
                              }}
                            >
                              <span>Ver link</span>
                              <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span style={{ color: '#4B5563', fontSize: '12px' }}>—</span>
                          )}
                        </td>

                        {/* Ações */}
                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                          <DeliverableActions deliverable={item} contracts={contracts} />
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
