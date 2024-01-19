'use client'

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import React, { FC } from 'react'

interface IHint {
	children: React.ReactNode
	description: string
	side?: 'left' | 'right' | 'top' | 'bottom'
	sideOffset: number
}

export const Hint: FC<IHint> = ({
	children,
	description,
	side = 'bottom',
	sideOffset = 0,
}) => {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={0}>
				<TooltipTrigger>{children}</TooltipTrigger>
				<TooltipContent
					side={side}
					sideOffset={sideOffset}
					className='break-words max-w-[220px] text-xs'
				>
					{description}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
