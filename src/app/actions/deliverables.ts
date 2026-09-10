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
 * Busca todas as contrapartidas/entregas cadastradas,
 * trazendo o Contrato e o Patrocinador associados.
 */
export async function getDeliverables() {
  return await prisma.deliverable.findMany({
    include: {
      contract: {
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
      },
    },
    orderBy: { prazo: 'asc' },
  })
}

/**
 * Cadastra uma nova contrapartida vinculada a um contrato.
 */
export async function createDeliverable(formData: FormData) {
  const contractId = formData.get('contractId') as string
  const descricao = formData.get('descricao') as string
  const tipo = formData.get('tipo') as string
  const prazoStr = formData.get('prazo') as string
  const status = (formData.get('status') as string) || 'PENDENTE'
  const comprovanteUrlRaw = formData.get('comprovanteUrl') as string
  const comprovanteUrl = comprovanteUrlRaw?.trim() ? comprovanteUrlRaw.trim() : null

  if (!contractId || !descricao || !tipo || !prazoStr) {
    throw new Error('Preencha os campos obrigatórios da contrapartida.')
  }

  const prazo = parseDateUTC(prazoStr)
  if (isNaN(prazo.getTime())) {
    throw new Error('Prazo de entrega inválido.')
  }

  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    console.warn("Ambiente em modo demonstração: criação bloqueada.");
    return;
  }

  await prisma.deliverable.create({
    data: {
      contractId,
      descricao: descricao.trim(),
      tipo,
      prazo,
      status,
      comprovanteUrl,
    },
  })

  revalidatePath('/deliverables')
  revalidatePath('/contracts')
  revalidatePath('/sponsors')
}

/**
 * Atualiza uma contrapartida existente.
 */
export async function updateDeliverable(formData: FormData) {
  const id = formData.get('id') as string
  const contractId = formData.get('contractId') as string
  const descricao = formData.get('descricao') as string
  const tipo = formData.get('tipo') as string
  const prazoStr = formData.get('prazo') as string
  const status = (formData.get('status') as string) || 'PENDENTE'
  const comprovanteUrlRaw = formData.get('comprovanteUrl') as string
  const comprovanteUrl = comprovanteUrlRaw?.trim() ? comprovanteUrlRaw.trim() : null

  if (!id || !contractId || !descricao || !tipo || !prazoStr) {
    throw new Error('Preencha todos os campos obrigatórios para atualização.')
  }

  const prazo = parseDateUTC(prazoStr)
  if (isNaN(prazo.getTime())) {
    throw new Error('Prazo de entrega inválido.')
  }

  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    console.warn("Ambiente em modo demonstração: mutação bloqueada.");
    return;
  }

  await prisma.deliverable.update({
    where: { id },
    data: {
      contractId,
      descricao: descricao.trim(),
      tipo,
      prazo,
      status,
      comprovanteUrl,
    },
  })

  revalidatePath('/deliverables')
  revalidatePath('/contracts')
  revalidatePath('/sponsors')
}

/**
 * Exclui uma contrapartida.
 */
export async function deleteDeliverable(formData: FormData) {
  const id = formData.get('id') as string

  if (!id) {
    throw new Error('ID da contrapartida não informado.')
  }

  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    console.warn("Ambiente em modo demonstração: mutação bloqueada.");
    return;
  }

  await prisma.deliverable.delete({
    where: { id },
  })

  revalidatePath('/deliverables')
  revalidatePath('/contracts')
  revalidatePath('/sponsors')
}
