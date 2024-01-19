import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Medal } from 'lucide-react'
import localFont from 'next/font/local'
import Link from 'next/link'

const headingFonts = localFont({
	src: '../../../public/fonts/font.woff2',
})

export default function Marketing() {
	return (
		<div className='flex items-center justify-center flex-col'>
			<div
				className={cn(
					'flex items-center justify-center flex-col',
					headingFonts.className
				)}
			>
				<div
					className='flex items-center mb-4 border shadow-sm p-4 bg-amber-100
				text-amber-700 rounded-full uppercase'
				>
					<Medal className='h-6 w-6 mr-2' />
					№1 Task managment
				</div>
				<h1 className='text-3xl md:text-6xl text-center text-neutral-800 mb-6'>
					Taskify helps team move
				</h1>
				<div
					className='text-3xl md:text-6xl bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white
					rounded-md p-4 w-fit'
				>
					work forward.
				</div>
			</div>
			<div className='text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center mx-auto'>
				Collaborate, manage projects, and reach new productivity peaks. From
				high rises to the home office, the way your team works is unique -
				accomplish it all Taskify.
			</div>
			<Button asChild className='mt-6' size={'lg'}>
				<Link href={'/sign-up'}>Get taskify for free</Link>
			</Button>
		</div>
	)
}
