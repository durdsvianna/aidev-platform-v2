import SidebarLayout from '@/components/layouts/SidebarLayout'

export default function SidebarRouteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SidebarLayout>{children}</SidebarLayout>
} 