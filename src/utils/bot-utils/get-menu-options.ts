import { Context } from '@/types/context.interface'

export const getMenuOptions = (ctx: Context) => ({
	...ctx.session
})
