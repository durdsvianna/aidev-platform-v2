'use client'

import HeaderSearch from './Search'
import HeaderNotifications from './Notifications'
import HeaderToggleTheme from './ToggleTheme'
import LocaleLanguage from '@/components/LocaleLanguage'

export default function HeaderButtons() {
  return (
    <div className="flex items-center space-x-2">
      <LocaleLanguage />
      <HeaderSearch />
      <HeaderNotifications />
      <HeaderToggleTheme />
    </div>
  )
} 