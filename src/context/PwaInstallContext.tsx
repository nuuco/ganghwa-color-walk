import { createContext, useContext, type ReactNode } from 'react'
import { usePwaInstall, type PwaInstallState } from '../hooks/usePwaInstall'

const PwaInstallContext = createContext<PwaInstallState | null>(null)

export function PwaInstallProvider({ children }: { children: ReactNode }) {
  const install = usePwaInstall()

  return <PwaInstallContext.Provider value={install}>{children}</PwaInstallContext.Provider>
}

export function usePwaInstallContext(): PwaInstallState {
  const value = useContext(PwaInstallContext)
  if (!value) {
    throw new Error('usePwaInstallContext must be used within PwaInstallProvider')
  }
  return value
}
