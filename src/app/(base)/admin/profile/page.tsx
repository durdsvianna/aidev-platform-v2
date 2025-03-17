import { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'User Profile - AI Development Platform',
}

export default function UserProfilePage() {
  redirect('/sidelayout/admin/profile')
} 