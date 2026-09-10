export const dynamic = 'force-dynamic';

import { getContracts, createContract } from '@/app/actions/contracts'
import { getSponsors } from '@/app/actions/sponsors'
import { ContractActions } from '@/components/ContractActions'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Gestão de Contratos | SponsorHub SPFC',
  description: 'Controle de acordos comerciais, valores e vigência de patrocínios do São Paulo FC.',
}

function formatarData(date: Date | string) {
  return new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
}

export default async function ContractsPage() {
  const [contracts, sponsors] = await Promise.all([
    getContracts(),
    getSponsors(),
  ])

  // Cálculo de métricas
  const totalVolume = contracts.reduce((acc, c) => acc + c.valor, 0)
  const totalAtivos = contracts.filter((c) => c.status === 'ATIVO').length
  const totalRenovacao = contracts.filter((c) => c.status === 'RENOVAÇÃO').length

  return (
    <div style={{ minHeight: '100%', backgroundColor: '#0A0D10', color: '#F3F4F6', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Painel de Métricas Rápidas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div style={{ backgroundColor: '#12161B', border: '1px solid #1E2328', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8A9297', letterSpacing: '0.5px' }}>
              Volume Financeiro Contratado
            </span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>
              R$ {totalVolume.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <span style={{ fontSize: '11px', color: '#6B7280' }}>Total consolidado de parcerias</span>
          </div>

          <div style={{ backgroundColor: '#12161B', border: '1px solid #1E2328', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8A9297', letterSpacing: '0.5px' }}>
              Contratos Ativos
            </span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#10B981' }}>
              {totalAtivos}
            </div>
            <span style={{ fontSize: '11px', color: '#6B7280' }}>Acordos em vigor</span>
          </div>

          <div style={{ backgroundColor: '#12161B', border: '1px solid #1E2328', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8A9297', letterSpacing: '0.5px' }}>
              Em Renovação
            </span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#F59E0B' }}>
              {totalRenovacao}
            </div>
            <span style={{ fontSize: '11px', color: '#6B7280' }}>Processos em negociação</span>
          </div>
        </div>

        {/* Card de Cadastro de Contrato */}
        <section style={{ backgroundColor: '#12161B', border: '1px solid #1E2328', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '4px', height: '18px', backgroundColor: '#D71920', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#FFFFFF', margin: 0 }}>
              Novo Contrato Comercial
            </h2>
          </div>

          <form action={createContract} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {/* Seleção do Patrocinador */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8A9297', marginBottom: '6px' }}>
                Patrocinador *
              </label>
              <select
                name="sponsorId"
                required
                defaultValue=""
                style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#0A0D10', border: '1px solid #283038', borderRadius: '8px', padding: '12px', color: '#FFF', fontSize: '13px', outline: 'none' }}
              >
                <option value="" disabled style={{ backgroundColor: '#12161B' }}>
                  Selecione a marca
                </option>
                {sponsors.map((s) => (
                  <option key={s.id} value={s.id} style={{ backgroundColor: '#12161B' }}>
                    {s.nome} ({s.nivelCota})
                  </option>
                ))}
              </select>
            </div>

            {/* Valor R$ */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8A9297', marginBottom: '6px' }}>
                Valor Total (R$) *
              </label>
              <input
                name="valor"
                type="number"
                step="0.01"
                placeholder="Ex: 5000000.00"
                required
                style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#0A0D10', border: '1px solid #283038', borderRadius: '8px', padding: '12px', color: '#FFF', fontSize: '13px', outline: 'none' }}
              />
            </div>

            {/* Data de Início */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8A9297', marginBottom: '6px' }}>
                Data de Início *
              </label>
              <input
                name="dataInicio"
                type="date"
                required
                style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#0A0D10', border: '1px solid #283038', borderRadius: '8px', padding: '12px', color: '#FFF', fontSize: '13px', outline: 'none' }}
              />
            </div>

            {/* Data de Fim */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8A9297', marginBottom: '6px' }}>
                Data de Fim *
              </label>
              <input
                name="dataFim"
                type="date"
                required
                style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#0A0D10', border: '1px solid #283038', borderRadius: '8px', padding: '12px', color: '#FFF', fontSize: '13px', outline: 'none' }}
              />
            </div>

            {/* Status */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8A9297', marginBottom: '6px' }}>
                Status Contratual *
              </label>
              <select
                name="status"
                required
                defaultValue="ATIVO"
                style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#0A0D10', border: '1px solid #283038', borderRadius: '8px', padding: '12px', color: '#FFF', fontSize: '13px', outline: 'none' }}
              >
                <option value="ATIVO" style={{ backgroundColor: '#12161B' }}>ATIVO</option>
                <option value="RENOVAÇÃO" style={{ backgroundColor: '#12161B' }}>RENOVAÇÃO</option>
                <option value="ENCERRADO" style={{ backgroundColor: '#12161B' }}>ENCERRADO</option>
              </select>
            </div>

            {/* Botão de Submissão */}
            <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
              <button
                type="submit"
                style={{
                  backgroundColor: '#D71920',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontWeight: 700,
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                Cadastrar Contrato
              </button>
            </div>
          </form>
        </section>

        {/* Tabela de Listagem de Contratos */}
        <section style={{ backgroundColor: '#12161B', border: '1px solid #1E2328', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E2328', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '4px', height: '18px', backgroundColor: '#FFFFFF', borderRadius: '2px' }} />
              <h2 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#FFFFFF', margin: 0 }}>
                Contratos Registrados
              </h2>
            </div>
            <span style={{ fontSize: '12px', color: '#8A9297', backgroundColor: '#1A2026', padding: '4px 10px', borderRadius: '20px', border: '1px solid #283038' }}>
              {contracts.length} {contracts.length === 1 ? 'contrato' : 'contratos'}
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#0E1216', borderBottom: '1px solid #1E2328' }}>
                  <th style={{ padding: '14px 24px', color: '#8A9297', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px' }}>Patrocinador</th>
                  <th style={{ padding: '14px 24px', color: '#8A9297', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px' }}>Cota</th>
                  <th style={{ padding: '14px 24px', color: '#8A9297', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px' }}>Valor</th>
                  <th style={{ padding: '14px 24px', color: '#8A9297', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px' }}>Vigência</th>
                  <th style={{ padding: '14px 24px', color: '#8A9297', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px' }}>Status</th>
                  <th style={{ padding: '14px 24px', color: '#8A9297', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {contracts.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#6B7280' }}>
                      Nenhum contrato cadastrado até o momento.
                    </td>
                  </tr>
                ) : (
                  contracts.map((item) => {
                    const statusColor =
                      item.status === 'ATIVO'
                        ? { bg: 'rgba(16, 185, 129, 0.15)', text: '#10B981', border: 'rgba(16, 185, 129, 0.3)' }
                        : item.status === 'RENOVAÇÃO'
                          ? { bg: 'rgba(245, 158, 11, 0.15)', text: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)' }
                          : { bg: 'rgba(107, 114, 128, 0.15)', text: '#9CA3AF', border: 'rgba(107, 114, 128, 0.3)' }

                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid #1A1F24' }}>
                        {/* Patrocinador e Segmento */}
                        <td style={{ padding: '16px 24px' }}>
                          <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{item.sponsor.nome}</div>
                          <div style={{ fontSize: '11px', color: '#8A9297' }}>{item.sponsor.categoria}</div>
                        </td>

                        {/* Cota */}
                        <td style={{ padding: '16px 24px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              backgroundColor:
                                item.sponsor.nivelCota === 'Master' || item.sponsor.nivelCota === 'Naming Rights'
                                  ? 'rgba(215, 25, 32, 0.15)'
                                  : '#1A2026',
                              color:
                                item.sponsor.nivelCota === 'Master' || item.sponsor.nivelCota === 'Naming Rights'
                                  ? '#D71920'
                                  : '#E5E7EB',
                              border:
                                item.sponsor.nivelCota === 'Master' || item.sponsor.nivelCota === 'Naming Rights'
                                  ? '1px solid rgba(215, 25, 32, 0.3)'
                                  : '1px solid #283038',
                            }}
                          >
                            {item.sponsor.nivelCota}
                          </span>
                        </td>

                        {/* Valor */}
                        <td style={{ padding: '16px 24px', fontWeight: 700, color: '#FFFFFF', fontFamily: 'monospace' }}>
                          R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>

                        {/* Vigência */}
                        <td style={{ padding: '16px 24px', color: '#9CA3AF', fontSize: '12px' }}>
                          {formatarData(item.dataInicio)} até {formatarData(item.dataFim)}
                        </td>

                        {/* Status */}
                        <td style={{ padding: '16px 24px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              backgroundColor: statusColor.bg,
                              color: statusColor.text,
                              border: `1px solid ${statusColor.border}`,
                            }}
                          >
                            {item.status}
                          </span>
                        </td>

                        {/* Ações */}
                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                          <ContractActions contract={item} sponsors={sponsors} />
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
