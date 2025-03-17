'use client'

import { useAccount, useDisconnect } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useEffect, useState } from 'react'

export function useWeb3() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | undefined>(undefined)
  
  // Safely access wagmi hooks with try/catch to prevent errors
  let modal: ReturnType<typeof useWeb3Modal> | undefined;
  let account: ReturnType<typeof useAccount> | undefined;
  let disconnect: (() => void) | undefined;
  
  try {
    modal = useWeb3Modal();
    account = useAccount();
    const disconnectHook = useDisconnect();
    disconnect = disconnectHook?.disconnect;
    
    useEffect(() => {
      if (account) {
        setIsConnected(!!account.isConnected);
        setAddress(account.address);
      }
    }, [account]);
  } catch (error) {
    console.error('Error in useWeb3 hook:', error);
  }

  return {
    address,
    isConnected,
    disconnect: disconnect || (() => console.log('Disconnect not available')),
    openConnectModal: () => {
      try {
        modal?.open();
      } catch (error) {
        console.error('Error opening connect modal:', error);
      }
    },
    openAccountModal: () => {
      try {
        modal?.open({ view: 'Account' });
      } catch (error) {
        console.error('Error opening account modal:', error);
      }
    },
    openNetworkModal: () => {
      try {
        modal?.open({ view: 'Networks' });
      } catch (error) {
        console.error('Error opening network modal:', error);
      }
    }
  }
} 