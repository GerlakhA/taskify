import Logo from '@/components/Logo'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const Navbar = () => {
	return (
		<div
			className='w-full h-14 bg-white fixed top-0 shadow-sm border-b px-4
      flex items-center'
		>
			<div className='md:max-w-screen-2xl mx-auto flex items-center w-full justify-between'>
				<Logo />
				<div className='w-full justify-between space-x-4 md:block md:w-auto items-center flex'>
					<Button asChild size={'sm'} variant={'outline'}>
						<Link href={'/sign-in'}>Login</Link>
					</Button>
					<Button asChild size={'sm'}>
						<Link href={'/sign-up'}>Get Taskify for free</Link>
					</Button>
				</div>
			</div>
		</div>
	)
}
