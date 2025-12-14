import { SWRConfig } from 'swr'

import { fetcher } from './api'

export default function SwrProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SWRConfig
      value={{
        fetcher,
      }}
    >
      {children}
    </SWRConfig>
  )
}