import Logo from '@/components/Logo'
import { Button } from '@/components/ui/button'

export const Footer = () => {
	return (
		<div className='w-full fixed bottom-0 shadow-sm border-t p-4 bg-slate-100'>
			<div className='md:max-w-screen-2xl mx-auto flex items-center w-full justify-between'>
				<Logo />
				<div className='w-full justify-between space-x-4 md:block md:w-auto items-center flex'>
					<Button size={'sm'} variant={'ghost'}>
						Privacy policy
					</Button>
					<Button size={'sm'} variant={'ghost'}>
						Terms of Service
					</Button>
				</div>
			</div>
		</div>
	)
}
