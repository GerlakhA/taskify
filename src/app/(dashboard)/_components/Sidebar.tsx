'use client'

import { Hint } from '@/components/Hint'
import { Accordion } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useOrganization, useOrganizationList } from '@clerk/nextjs'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { FC } from 'react'
import { useLocalStorage } from 'usehooks-ts'
import NavItem, { Organization, SkeletonNavItem } from './NavItem'

interface ISidebar {
	storageKey?: string
}

const Sidebar: FC<ISidebar> = ({ storageKey = 't-sidebar-state' }) => {
	const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
		storageKey,
		{}
	)

	const { organization: activeOrganization, isLoaded: isLoadedOrg } =
		useOrganization()

	const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({
		userMemberships: {
			infinite: true,
		},
	})

	const defaultAccordionValue: string[] = Object.keys(expanded).reduce(
		(acc: string[], key: string) => {
			if (expanded[key]) {
				acc.push(key)
			}

			return acc
		},
		[]
	)

	const onExpand = (id: string) => {
		setExpanded(curr => ({
			...curr,
			[id]: !expanded[id],
		}))
	}

	if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading) {
		return (
			<>
				<div className='flex justify-between items-center mb-2'>
					<Skeleton className='h-10 w-[50%]' />
					<Skeleton className='h-10 w-10' />
				</div>
				<div className='space-y-2'>
					<SkeletonNavItem />
					<SkeletonNavItem />
					<SkeletonNavItem />
				</div>
			</>
		)
	}

	return (
		<>
			<div className='font-medium mb-1 flex items-center justify-between text-xs'>
				<span className='pl-4'>Workspaces</span>
				<Hint side='left' sideOffset={10} description='Create organization'>
					<Button asChild size={'icon'} variant={'ghost'}>
						<Link href={'/select-org'}>
							<PlusIcon className='h-4 w-4' />
						</Link>
					</Button>
				</Hint>
			</div>
			<Accordion
				type='multiple'
				defaultValue={defaultAccordionValue}
				className='space-y-2'
			>
				{userMemberships.data.map(({ organization }) => (
					<NavItem
						key={organization.id}
						isActive={activeOrganization?.id === organization.id}
						isExpanded={expanded[organization.id]}
						organization={organization as Organization}
						onExpand={onExpand}
					/>
				))}
			</Accordion>
		</>
	)
}

export default Sidebar
