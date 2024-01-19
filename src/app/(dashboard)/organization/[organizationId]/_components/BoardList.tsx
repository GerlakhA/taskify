import { Hint } from '@/components/Hint'
import { FormPopover } from '@/components/form/Form-Popover'
import { Skeleton } from '@/components/ui/skeleton'
import { dbPrisma } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { HelpCircle, User2 } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const BoardList = async () => {
	const { orgId } = auth()

	if (!orgId) return redirect('/select-org')

	const boards = await dbPrisma.board.findMany({
		where: {
			orgId,
		},
		orderBy: {
			createdAt: 'desc',
		},
	})

	return (
		<div className='space-y-4'>
			<div className='flex items-center font-semibold text-lg text-neitral-700'>
				<User2 className='h-6 w-6 mr-2' />
				Your Boards
			</div>
			<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
				{boards.map(board => (
					<Link
						key={board.id}
						href={`/board/${board.id}`}
						style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
						className='rounded-sm group relative aspect-video bg-no-repeat bg-center bg-cover
						bg-sky-700 h-full w-full p-2 overflow-hidden'
					>
						<div className='group-hover:bg-black/40 absolute transition inset-0' />
						<p className='relative font-semibold text-white'>{board.title}</p>
					</Link>
				))}
				<FormPopover sideOffset={10} side='right'>
					<div
						role='button'
						className='flex justify-center items-center aspect-video relative h-full
          w-full rounded-sm flex-col gap-y-1 hover:opacity-75 transition bg-muted'
					>
						<p>Create new board</p>
						<span>5 remaining</span>
						<Hint
							sideOffset={35}
							description='Free Workspaces can have up to 5 open boards. For unlimited boards upgrade this workspace.'
						>
							<HelpCircle className='absolute bottom-2 right-2 h-[14px] w-[14px]' />
						</Hint>
					</div>
				</FormPopover>
			</div>
		</div>
	)
}

export default BoardList

BoardList.Skeleton = function BoardListSkeleton() {
	return (
		<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
			<Skeleton className='aspect-video h-full w-full p-2' />
			<Skeleton className='aspect-video h-full w-full p-2' />
			<Skeleton className='aspect-video h-full w-full p-2' />
			<Skeleton className='aspect-video h-full w-full p-2' />
			<Skeleton className='aspect-video h-full w-full p-2' />
			<Skeleton className='aspect-video h-full w-full p-2' />
			<Skeleton className='aspect-video h-full w-full p-2' />
			<Skeleton className='aspect-video h-full w-full p-2' />
			<Skeleton className='aspect-video h-full w-full p-2' />
		</div>
	)
}
