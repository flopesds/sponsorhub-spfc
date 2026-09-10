export const dynamic = 'force-dynamic';

import { getSponsors, createSponsor } from '@/app/actions/sponsors'
import { SponsorActions } from '@/components/SponsorActions'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Gestão de Patrocinadores | SponsorHub SPFC',
  description: 'Cadastro e gestão de marcas parceiras e cotas do São Paulo FC.',
}

export default async function SponsorsPage() {
  const sponsors = await getSponsors()

  return (
    <div style={{ minHeight: '100%', backgroundColor: '#0A0D10', color: '#F3F4F6', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {/* Card de Cadastro */}
        <section style={{ backgroundColor: '#12161B', border: '1px solid #1E2328', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '4px', height: '18px', backgroundColor: '#D71920', borderRadius: '2px' }} />
            <h2 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#FFFFFF', margin: 0 }}>
              Cadastrar Patrocinador
            </h2>
          </div>

          <form action={createSponsor} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8A9297', marginBottom: '6px' }}>Marca</label>
              <input
                name="nome"
                type="text"
                placeholder="Ex: Superbet, New Balance"
                required
                style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#0A0D10', border: '1px solid #283038', borderRadius: '8px', padding: '12px', color: '#FFF', fontSize: '13px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8A9297', marginBottom: '6px' }}>Segmento</label>
              <input
                name="categoria"
                type="text"
                placeholder="Ex: Material Esportivo, Apostas"
                required
                style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#0A0D10', border: '1px solid #283038', borderRadius: '8px', padding: '12px', color: '#FFF', fontSize: '13px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8A9297', marginBottom: '6px' }}>Cota Contratual</label>
              <select
                name="nivelCota"
                required
                defaultValue=""
                style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#0A0D10', border: '1px solid #283038', borderRadius: '8px', padding: '12px', color: '#FFF', fontSize: '13px', outline: 'none' }}
              >
                <option value="" disabled style={{ backgroundColor: '#12161B' }}>Selecione a cota</option>
                <option value="Master" style={{ backgroundColor: '#12161B' }}>Master</option>
                <option value="Naming Rights" style={{ backgroundColor: '#12161B' }}>Naming Rights</option>
                <option value="Ouro" style={{ backgroundColor: '#12161B' }}>Ouro</option>
                <option value="Prata" style={{ backgroundColor: '#12161B' }}>Prata</option>
                <option value="Bronze" style={{ backgroundColor: '#12161B' }}>Bronze</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8A9297', marginBottom: '6px' }}>Pessoa de Contato</label>
              <input
                name="contato"
                type="text"
                placeholder="Nome do interlocutor"
                required
                style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#0A0D10', border: '1px solid #283038', borderRadius: '8px', padding: '12px', color: '#FFF', fontSize: '13px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8A9297', marginBottom: '6px' }}>E-mail Corporativo</label>
              <input
                name="email"
                type="email"
                placeholder="contato@empresa.com"
                required
                style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#0A0D10', border: '1px solid #283038', borderRadius: '8px', padding: '12px', color: '#FFF', fontSize: '13px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#8A9297', marginBottom: '6px' }}>Telefone</label>
              <input
                name="telefone"
                type="text"
                placeholder="+55 11 99999-9999"
                style={{ width: '100%', boxSizing: 'border-box', backgroundColor: '#0A0D10', border: '1px solid #283038', borderRadius: '8px', padding: '12px', color: '#FFF', fontSize: '13px', outline: 'none' }}
              />
            </div>

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
                  gap: '8px'
                }}
              >
                Cadastrar Parceiro
              </button>
            </div>
          </form>
        </section>

        {/* Tabela de Listagem */}
        <section style={{ backgroundColor: '#12161B', border: '1px solid #1E2328', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #1E2328', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '4px', height: '18px', backgroundColor: '#FFFFFF', borderRadius: '2px' }} />
              <h2 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#FFFFFF', margin: 0 }}>
                Patrocinadores Ativos
              </h2>
            </div>
            <span style={{ fontSize: '12px', color: '#8A9297', backgroundColor: '#1A2026', padding: '4px 10px', borderRadius: '20px', border: '1px solid #283038' }}>
              {sponsors.length} {sponsors.length === 1 ? 'contrato' : 'contratos'}
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#0E1216', borderBottom: '1px solid #1E2328' }}>
                  <th style={{ padding: '14px 24px', color: '#8A9297', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px' }}>Marca</th>
                  <th style={{ padding: '14px 24px', color: '#8A9297', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px' }}>Segmento</th>
                  <th style={{ padding: '14px 24px', color: '#8A9297', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px' }}>Cota</th>
                  <th style={{ padding: '14px 24px', color: '#8A9297', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px' }}>Contato</th>
                  <th style={{ padding: '14px 24px', color: '#8A9297', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px' }}>E-mail</th>
                  <th style={{ padding: '14px 24px', color: '#8A9297', fontWeight: 700, textTransform: 'uppercase', fontSize: '11px', textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {sponsors.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#6B7280' }}>
                      Nenhum parceiro cadastrado até o momento.
                    </td>
                  </tr>
                ) : (
                  sponsors.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #1A1F24' }}>
                      <td style={{ padding: '16px 24px', fontWeight: 700, color: '#FFFFFF' }}>{item.nome}</td>
                      <td style={{ padding: '16px 24px', color: '#9CA3AF' }}>{item.categoria}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          backgroundColor: item.nivelCota === 'Master' || item.nivelCota === 'Naming Rights' ? 'rgba(215, 25, 32, 0.15)' : '#1A2026',
                          color: item.nivelCota === 'Master' || item.nivelCota === 'Naming Rights' ? '#D71920' : '#E5E7EB',
                          border: item.nivelCota === 'Master' || item.nivelCota === 'Naming Rights' ? '1px solid rgba(215, 25, 32, 0.3)' : '1px solid #283038'
                        }}>
                          {item.nivelCota}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', color: '#9CA3AF' }}>{item.contato}</td>
                      <td style={{ padding: '16px 24px', color: '#9CA3AF', fontFamily: 'monospace', fontSize: '12px' }}>{item.email}</td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <SponsorActions sponsor={item} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}
