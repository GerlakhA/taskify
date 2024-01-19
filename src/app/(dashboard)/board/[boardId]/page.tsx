import { dbPrisma } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { FC } from 'react'
import ListContainer from './_components/ListContainer'

interface IBoardId {
	params: { boardId: string }
}

const BoradIdPage: FC<IBoardId> = async ({ params }) => {
	const { orgId } = auth()

	if (!orgId) {
		redirect('/select-org')
	}

	const lists = await dbPrisma.list?.findMany({
		where: {
			boardId: params.boardId,
			board: {
				orgId,
			},
		},
		include: {
			cards: {
				orderBy: {
					order: 'asc',
				},
			},
		},
		orderBy: {
			order: 'asc',
		},
	})

	return (
		<div className='p-4 h-full overflow-x-auto'>
			<ListContainer boardId={params.boardId} data={lists} />
		</div>
	)
}

export default BoradIdPage
