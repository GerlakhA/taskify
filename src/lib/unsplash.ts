import { createApi } from 'unsplash-js'

export const unsplash = createApi({
	accessKey: process.env.NEXT_PUBLIC_UNSPLAH_ACCESS_KEY!,
	fetch: fetch,
})
