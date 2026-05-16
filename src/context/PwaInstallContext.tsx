import { createContext, useContext, type ReactNode } from 'react'
import { InstallPromptModal } from '../components/overlays/InstallPromptModal'
import { usePwaInstall, type PwaInstallState } from '../hooks/usePwaInstall'

const PwaInstallContext = createContext<PwaInstallState | null>(null)

export function PwaInstallProvider({ children }: { children: ReactNode }) {
  const install = usePwaInstall()

  return (
    <PwaInstallContext.Provider value={install}>
      {children}
      <InstallPromptModal
        open={install.open}
        scenario={install.scenario}
        isInstalling={install.isInstalling}
        onClose={install.closeInstallPrompt}
        onNativeInstall={install.runNativeInstall}
      />
    </PwaInstallContext.Provider>
  )
}

export function usePwaInstallContext(): PwaInstallState {
  const value = useContext(PwaInstallContext)
  if (!value) {
    throw new Error('usePwaInstallContext must be used within PwaInstallProvider')
  }
  return value
}
