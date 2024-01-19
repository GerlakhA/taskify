import { dbPrisma } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { notFound, redirect } from 'next/navigation'
import { BoardNavbar } from './_components/BoardNavbar'

const BoradIdLayout = async ({
	children,
	params,
}: {
	children: React.ReactNode
	params: { boardId: string }
}) => {
	const { orgId } = auth()

	if (!orgId) redirect(`/select-org`)

	const board = await dbPrisma.board.findUnique({
		where: {
			id: params.boardId,
			orgId,
		},
	})

	if (!board) {
		notFound()
	}

	return (
		<div
			className='bg-no-repeat bg-cover relative h-full'
			style={{
				backgroundImage: `url(${board.imageFullUrl})`,
				backgroundPosition: 'center',
			}}
		>
			<BoardNavbar data={board} />
			<div className='absolute inset-0 bg-black/10' />
			<main className='relative pt-28 h-full'>{children}</main>
		</div>
	)
}

export default BoradIdLayout
