'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

function parseDateUTC(dateStr: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return new Date(`${dateStr}T00:00:00.000Z`)
  }
  return new Date(dateStr)
}

/**
 * Busca todos os contratos cadastrados trazendo o Patrocinador relacionado.
 */
export async function getContracts() {
  return await prisma.contract.findMany({
    include: {
      sponsor: {
        select: {
          id: true,
          nome: true,
          categoria: true,
          nivelCota: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

/**
 * Cadastra um novo contrato.
 */
export async function createContract(formData: FormData) {
  const sponsorId = formData.get('sponsorId') as string
  const valorStr = formData.get('valor') as string
  const dataInicioStr = formData.get('dataInicio') as string
  const dataFimStr = formData.get('dataFim') as string
  const status = (formData.get('status') as string) || 'ATIVO'

  if (!sponsorId || !valorStr || !dataInicioStr || !dataFimStr) {
    throw new Error('Preencha todos os campos obrigatórios do contrato.')
  }

  const valor = parseFloat(valorStr.replace(/\./g, '').replace(',', '.'))
  if (isNaN(valor) || valor <= 0) {
    throw new Error('Informe um valor numérico válido para o contrato.')
  }

  const dataInicio = parseDateUTC(dataInicioStr)
  const dataFim = parseDateUTC(dataFimStr)

  if (isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())) {
    throw new Error('Datas de início ou fim inválidas.')
  }

  await prisma.contract.create({
    data: {
      sponsorId,
      valor,
      dataInicio,
      dataFim,
      status,
    },
  })

  revalidatePath('/contracts')
  revalidatePath('/sponsors')
}

/**
 * Atualiza um contrato existente.
 */
export async function updateContract(formData: FormData) {
  const id = formData.get('id') as string
  const sponsorId = formData.get('sponsorId') as string
  const valorStr = formData.get('valor') as string
  const dataInicioStr = formData.get('dataInicio') as string
  const dataFimStr = formData.get('dataFim') as string
  const status = (formData.get('status') as string) || 'ATIVO'

  if (!id || !sponsorId || !valorStr || !dataInicioStr || !dataFimStr) {
    throw new Error('Preencha todos os campos obrigatórios para atualização.')
  }

  const valor = parseFloat(valorStr.replace(/\./g, '').replace(',', '.'))
  if (isNaN(valor) || valor <= 0) {
    throw new Error('Informe um valor numérico válido para o contrato.')
  }

  const dataInicio = parseDateUTC(dataInicioStr)
  const dataFim = parseDateUTC(dataFimStr)

  await prisma.contract.update({
    where: { id },
    data: {
      sponsorId,
      valor,
      dataInicio,
      dataFim,
      status,
    },
  })

  revalidatePath('/contracts')
  revalidatePath('/sponsors')
}

/**
 * Exclui um contrato.
 */
export async function deleteContract(formData: FormData) {
  const id = formData.get('id') as string

  if (!id) {
    throw new Error('ID do contrato não informado.')
  }

  await prisma.contract.delete({
    where: { id },
  })

  revalidatePath('/contracts')
  revalidatePath('/sponsors')
}
