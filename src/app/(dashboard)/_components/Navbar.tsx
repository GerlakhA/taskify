import Logo from '@/components/Logo'
import { FormPopover } from '@/components/form/Form-Popover'
import { Button } from '@/components/ui/button'
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'
import { PlusIcon } from 'lucide-react'
import MobileNavbar from './MobileSidebar'

const Navbar = () => {
	return (
		<nav className='fixed z-50 top-0 w-full bg-white h-14 border-b shadow-sm flex items-center'>
			<MobileNavbar />
			<div className='flex items-center justify-center gap-x-4 px-4'>
				<div className='hidden md:flex '>
					<Logo />
				</div>
				<FormPopover align='start' side='bottom' sideOffset={18}>
					<Button
						size={'sm'}
						variant={'primary'}
						className='hidden md:block rounded-sm h-auto py-1.5 px-2'
					>
						Create
					</Button>
				</FormPopover>
				<FormPopover align='start' side='bottom' sideOffset={18}>
					<Button
						variant={'primary'}
						className='md:hidden block rounded-sm'
						size={'sm'}
					>
						<PlusIcon className='h-4 w-4' />
					</Button>
				</FormPopover>
			</div>
			<div className='ml-auto flex items-center gap-x-2 px-4'>
				<OrganizationSwitcher
					hidePersonal
					afterCreateOrganizationUrl={'/organization/:id'}
					afterSelectOrganizationUrl={'/organization/:id'}
					afterLeaveOrganizationUrl='/select-org'
					appearance={{
						elements: {
							rootBox: {
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							},
						},
					}}
				/>
				<UserButton
					afterSignOutUrl='/'
					appearance={{
						elements: {
							avatarBox: {
								height: 30,
								width: 30,
							},
						},
					}}
				/>
			</div>
		</nav>
	)
}

export default Navbar
