'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getSponsors() {
  return await prisma.sponsor.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function createSponsor(formData: FormData) {
  const nome = formData.get('nome') as string
  const categoria = formData.get('categoria') as string
  const nivelCota = formData.get('nivelCota') as string
  const contato = formData.get('contato') as string
  const email = formData.get('email') as string
  const telefone = formData.get('telefone') as string

  if (!nome || !categoria || !nivelCota || !email) {
    throw new Error('Preencha os campos obrigatórios.')
  }

  await prisma.sponsor.create({
    data: {
      nome,
      categoria,
      nivelCota,
      contato,
      email,
      telefone: telefone || null,
    },
  })

  revalidatePath('/sponsors')
}

export async function updateSponsor(formData: FormData) {
  const id = formData.get('id') as string
  const nome = formData.get('nome') as string
  const categoria = formData.get('categoria') as string
  const nivelCota = formData.get('nivelCota') as string
  const contato = formData.get('contato') as string
  const email = formData.get('email') as string
  const telefone = formData.get('telefone') as string

  if (!id || !nome || !categoria || !nivelCota || !email) {
    throw new Error('Dados inválidos para atualização.')
  }

  await prisma.sponsor.update({
    where: { id },
    data: {
      nome,
      categoria,
      nivelCota,
      contato,
      email,
      telefone: telefone || null,
    },
  })

  revalidatePath('/sponsors')
}

export async function deleteSponsor(formData: FormData) {
  const id = formData.get('id') as string

  if (!id) throw new Error('ID não informado.')

  await prisma.sponsor.delete({
    where: { id },
  })

  revalidatePath('/sponsors')
}
