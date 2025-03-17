import { redirect } from 'next/navigation';
import type { Metadata } from 'next'
import Link from 'next/link'
import { FaRobot, FaBrain, FaChartLine, FaCode, FaServer, FaMobile } from 'react-icons/fa'

export const metadata: Metadata = {
  title: 'Home - AI Development Platform',
}

export default function HomePage() {
  redirect('/sidelayout');
} 