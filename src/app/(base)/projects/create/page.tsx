import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Create AI Project - AI Development Platform',
}

export default function CreateProjectPage() {
  redirect('/sidelayout/projects/create')
} 