'use client'

import ErrorContent from '@/app/content/pages/Status/Error'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorContent error={error} reset={reset} />
} 