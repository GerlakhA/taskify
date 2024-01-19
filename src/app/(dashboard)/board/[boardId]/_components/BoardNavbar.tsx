import { Board } from '@prisma/client'
import { FC } from 'react'
import { BoardOptions } from './BoardOptions'
import BoardTitleForm from './BoardTitleForm'

interface IBoardNavbar {
	data: Board
}

export const BoardNavbar: FC<IBoardNavbar> = async ({ data }) => {
	return (
		<div
			className='fixed h-14 w-full text-white bg-black/30 top-14 z-[40] px-6
    gap-x-4 flex items-center'
		>
			<BoardTitleForm data={data} />
			<div className='ml-auto'>
				<BoardOptions id={data.id} />
			</div>
		</div>
	)
}
