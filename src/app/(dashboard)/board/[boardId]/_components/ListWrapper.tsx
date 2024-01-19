import { FC } from 'react'

interface IListWrapper {
	children: React.ReactNode
}

const ListWrapper: FC<IListWrapper> = ({ children }) => {
	return <li className='shrink-0 h-full w-[272px] select-none'>{children}</li>
}

export default ListWrapper
