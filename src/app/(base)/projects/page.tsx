import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'AI Projects - AI Development Platform',
}

export default function ProjectsPage() {
  redirect('/sidelayout/projects')
} 