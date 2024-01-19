'use client'

import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Activity, CreditCard, Layout, Settings } from 'lucide-react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { FC } from 'react'

export type Organization = {
	id: string
	slug: string
	imageUrl: string
	name: string
}

interface INavItem {
	organization: Organization
	onExpand: (id: string) => void
	isActive: boolean
	isExpanded: boolean
}

const NavItem: FC<INavItem> = ({
	onExpand,
	organization,
	isActive,
	isExpanded,
}) => {
	const router = useRouter()
	const pathname = usePathname()
	const routes = [
		{
			label: 'Boards',
			icon: <Layout className='h-4 w-4 mr-2' />,
			href: `/organization/${organization.id}`,
		},
		{
			label: 'Activity',
			icon: <Activity className='h-4 w-4 mr-2' />,
			href: `/organization/${organization.id}/activity`,
		},
		{
			label: 'Billing',
			icon: <CreditCard className='h-4 w-4 mr-2' />,
			href: `/organization/${organization.id}/billing`,
		},
		{
			label: 'Settings',
			icon: <Settings className='h-4 w-4 mr-2' />,
			href: `/organization/${organization.id}/settings`,
		},
	]

	const onClick = (href: string) => {
		router.push(href)
	}

	return (
		<AccordionItem value={organization.id} className='border-none'>
			<AccordionTrigger
				onClick={() => onExpand(organization.id)}
				className={cn(
					'flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 transition text-start no-underline hover:no-underline',
					isActive && !isExpanded && 'bg-sky-500/10 text-sky-700'
				)}
			>
				<div className='flex items-center gap-x-2'>
					<div className='w-7 h-7 relative'>
						<Image
							src={organization.imageUrl}
							fill
							alt='Organization'
							className='rounded-sm object-cover'
						/>
					</div>
					<span className='text-sm font-medium'>{organization.name}</span>
				</div>
			</AccordionTrigger>
			<AccordionContent className='pt-1 text-neutral-700'>
				{routes.map(item => (
					<Button
						key={item.href}
						onClick={() => onClick(item.href)}
						className={cn(
							'w-full font-normal justify-start pl-10 mb-1',
							pathname === item.href && 'bg-sky-500/10 text-sky-700'
						)}
						size={'sm'}
						variant={'ghost'}
					>
						{item.icon}
						{item.label}
					</Button>
				))}
			</AccordionContent>
		</AccordionItem>
	)
}

export default NavItem

export const SkeletonNavItem = () => {
	return (
		<div className='flex items-center gap-x-2'>
			<div className='w-10 h-10 relative shrink-0'>
				<Skeleton className='h-full w-full absolute' />
			</div>
			<Skeleton className='h-10 w-full' />
		</div>
	)
}
