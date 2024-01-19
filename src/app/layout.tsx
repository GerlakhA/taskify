import ModalProvider from '@/components/providers/ModalProvider'
import MyQueryProvider from '@/components/providers/MyQueryProvider'
import { siteConfig } from '@/config/siteConfig'
import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	icons: '/logo.svg',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<ClerkProvider>
			<html lang='en'>
				<body className={inter.className}>
					<MyQueryProvider>
						<Toaster position='top-center' />
						<ModalProvider />
						{children}
					</MyQueryProvider>
				</body>
			</html>
		</ClerkProvider>
	)
}
