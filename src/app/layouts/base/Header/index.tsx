'use client'

import { useState, useEffect } from 'react'
import { Address } from 'viem'
import HeaderMenu from './Menu'
import HeaderButtons from './Buttons'
import HeaderUserbox from './Userbox'
import HeaderUserConnect from './UserConnect'

export default function Header() {
  const [isConnected, setConnected] = useState<boolean>(false)
  const [account, setAccount] = useState<Address>()

  const connect = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const selectedAddress = await window.ethereum.request({ 
          method: 'eth_requestAccounts', 
          params: [] 
        })
        
        if (selectedAddress && selectedAddress.length > 0) {
          setAccount(selectedAddress[0] as Address)
          setConnected(true)
        }
      } catch (error) {
        console.log('Connection error:', error)
      }
    }
  }

  useEffect(() => {
    if (!isConnected) {
      connect()
    }
  }, [isConnected])

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/95 dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <HeaderMenu />
        </div>
        
        <div className="flex items-center space-x-2">
          <HeaderButtons />
          {isConnected ? (
            <HeaderUserbox address={account} />
          ) : (
            <HeaderUserConnect />
          )}
        </div>
      </div>
    </header>
  )
} 