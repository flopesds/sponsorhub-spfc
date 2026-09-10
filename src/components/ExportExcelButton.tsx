'use client';

import * as XLSX from 'xlsx';

export interface Sponsor {
  name?: string;
  nome?: string;
  tier?: string;
  nivelCota?: string;
  [key: string]: any;
}

export interface Contract {
  totalValue?: number | string;
  valor?: number | string;
  startDate?: string | Date;
  dataInicio?: string | Date;
  endDate?: string | Date;
  dataFim?: string | Date;
  status: string;
  sponsor?: Sponsor | null;
  [key: string]: any;
}

export interface Deliverable {
  description?: string;
  descricao?: string;
  type?: string;
  tipo?: string;
  dueDate?: string | Date;
  prazo?: string | Date;
  status: string;
  proofUrl?: string | null;
  comprovanteUrl?: string | null;
  contract?: {
    sponsor?: Sponsor | null;
    [key: string]: any;
  } | null;
  [key: string]: any;
}

export interface ExportProps {
  contracts: Contract[];
  deliverables: Deliverable[];
  selectedSponsorName?: string;
}

export function ExportExcelButton({
  contracts,
  deliverables,
  selectedSponsorName = 'Todas_As_Marcas',
}: ExportProps) {
  const exportarExcel = () => {
    // 1. Aba: Contratos Vigentes
    const dadosContratos = contracts.map((c) => {
      const sponsorName = c.sponsor?.name || c.sponsor?.nome || 'N/A';
      const cota = c.sponsor?.tier || c.sponsor?.nivelCota || 'OFICIAL';
      const rawValor = c.totalValue !== undefined ? c.totalValue : c.valor;
      const dataInicio = c.startDate || c.dataInicio;
      const dataFim = c.endDate || c.dataFim;

      return {
        PATROCINADOR: sponsorName,
        COTA: cota,
        'VALOR TOTAL (R$)': Number(rawValor || 0).toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
        }),
        'DATA INÍCIO': dataInicio ? new Date(dataInicio).toLocaleDateString('pt-BR') : 'N/A',
        'DATA FIM': dataFim ? new Date(dataFim).toLocaleDateString('pt-BR') : 'N/A',
        'STATUS CONTRATUAL': c.status,
      };
    });

    // 2. Aba: Entregas Realizadas
    const dadosEntregas = deliverables.map((d) => {
      const sponsorName = d.contract?.sponsor?.name || d.contract?.sponsor?.nome || 'N/A';
      const descricao = d.description || d.descricao || '';
      const tipo = d.type || d.tipo || '';
      const prazo = d.dueDate || d.prazo;
      const comprovante = d.proofUrl || d.comprovanteUrl;

      return {
        PATROCINADOR: sponsorName,
        CONTRAPARTIDA: descricao,
        'CANAL/LOCAL': tipo,
        'PRAZO ACORDADO': prazo ? new Date(prazo).toLocaleDateString('pt-BR') : 'N/A',
        'DATA EXECUÇÃO': prazo ? new Date(prazo).toLocaleDateString('pt-BR') : 'N/A',
        'STATUS OPERACIONAL': d.status,
        'COMPROVAÇÃO/OBSERVAÇÕES': comprovante || 'Comprovante em arquivo físico / sem link',
      };
    });

    // 3. Montagem do Workbook
    const workbook = XLSX.utils.book_new();
    const sheetContratos = XLSX.utils.json_to_sheet(dadosContratos);
    const sheetEntregas = XLSX.utils.json_to_sheet(dadosEntregas);

    XLSX.utils.book_append_sheet(workbook, sheetContratos, 'Contratos Vigentes');
    XLSX.utils.book_append_sheet(workbook, sheetEntregas, 'Entregas Realizadas');

    // 4. Download com nomenclatura dinâmica do Spark
    const hoje = new Date().toISOString().split('T')[0];
    const nomeSaneado = selectedSponsorName.replace(/\s+/g, '_');
    XLSX.writeFile(workbook, `Entregas_Realizadas_SponsorHub_${nomeSaneado}_${hoje}.xlsx`);
  };

  return (
    <button
      onClick={exportarExcel}
      type="button"
      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg transition shadow-md hover:shadow-emerald-900/30"
    >
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
      </svg>
      Exportar Relatório (.xlsx)
    </button>
  );
}

export default ExportExcelButton;
