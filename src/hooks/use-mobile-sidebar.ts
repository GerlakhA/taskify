import { create } from 'zustand'

type TypeMobileSidebarStore = {
	isOpen: boolean
	onOpen: () => void
	onClose: () => void
}

export const useMobileSidebar = create<TypeMobileSidebarStore>(set => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}))
