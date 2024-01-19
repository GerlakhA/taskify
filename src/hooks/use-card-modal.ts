import { create } from 'zustand'

type TypeCardModalStore = {
	id?: string
	isOpen: boolean
	onOpen: (id: string) => void
	onClose: () => void
}

export const useCardModal = create<TypeCardModalStore>(set => ({
	id: undefined,
	isOpen: false,
	onOpen: (id: string) => set({ isOpen: true, id }),
	onClose: () => set({ isOpen: false, id: undefined }),
}))
