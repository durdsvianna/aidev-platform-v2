import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Home - AI Development Platform',
}

export default function HomePage() {
  redirect('/sidelayout');
} 