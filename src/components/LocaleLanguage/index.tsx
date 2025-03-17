'use client'

import { useEffect, useState, MouseEvent } from "react"
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import SuspenseLoader from '@/components/SuspenseLoader'

export default function LocaleLanguage() {
  const [lang, setLang] = useState<string>(i18next.language)
  const { t, i18n, ready } = useTranslation(['common'])
  const [loading, setLoading] = useState<boolean>(true)
  
  const changeLanguage = (event: MouseEvent<HTMLButtonElement>): void => {
    const langKey = event.currentTarget.getAttribute('data-lang')
    setLang(langKey || '')
    i18n.changeLanguage(langKey || '')
  }

  useEffect(() => {
    if (ready) {
      setLoading(false)
    }
  }, [ready])
  
  if (loading) {
    return null
  }

  return (
    <div className="flex items-center" title="Change Language">
      <button 
        className="w-8 h-5 mr-2 border-none focus:outline-none cursor-pointer"
        onClick={changeLanguage}
        data-lang="pt-BR"
      >
        <img 
          src="/static/images/lang/pt_flag.jpg"
          alt="Portuguese"
          className="w-full h-full object-cover"
        />
      </button>
      <button 
        className="w-8 h-5 mr-2 border-none focus:outline-none cursor-pointer"
        onClick={changeLanguage}
        data-lang="en"
      >
        <img 
          src="/static/images/lang/en_flag.jpg"
          alt="English"
          className="w-full h-full object-cover"
        />
      </button>
    </div>
  )
}
  