'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FC, useState } from 'react'

interface IMyQueryProvider {
	children: React.ReactNode
}

const MyQueryProvider: FC<IMyQueryProvider> = ({ children }) => {
	const [client] = useState(() => new QueryClient())
	return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

export default MyQueryProvider
