// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Context Imports
import { IntersectionProvider } from '@/contexts/intersectionContext'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import FrontLayout from '@components/layout/front-pages'

import { ArweaveWalletKit } from "arweave-wallet-kit"
import { AuthProvider } from '@/context/AuthContext'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'Materio - Material Design Next.js Admin Template',
  description:
    'Materio - Material Design Next.js Admin Dashboard Template - is the most developer friendly & highly customizable Admin Dashboard Template based on MUI v5.'
}

const Layout = ({ children }: ChildrenType) => {
  // Vars
  const systemMode = 'light'

  return (
    <html id='__next'>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <ArweaveWalletKit
          config={{
            permissions: ["ACCESS_ADDRESS", "SIGN_TRANSACTION", "DISPATCH", "ACCESS_ALL_ADDRESSES"],
            ensurePermissions: true,
            appInfo: {
              name: "StarterKit",
            },
          }}
        >
          <AuthProvider>
            <Providers direction='ltr'>
              <BlankLayout systemMode={systemMode}>
                <IntersectionProvider>
                  <FrontLayout>{children}</FrontLayout>
                </IntersectionProvider>
              </BlankLayout>
            </Providers>
          </AuthProvider>
        </ArweaveWalletKit>
      </body>
    </html>
  )
}

export default Layout
