import BaseLayout from '@/app/layouts/BaseLayout'

export default function BaseRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <BaseLayout>{children}</BaseLayout>
} 