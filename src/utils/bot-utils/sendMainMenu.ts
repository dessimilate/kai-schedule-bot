import { Context } from '@/types/context.interface'
import { getDayInfo } from '@/utils/dayinfo-utils/getDayInfo'
import { mainButtons } from '@/buttons/main.buttons'
import { getMenuOptions } from './getMenuOptions'

export const sendMainMenu = async (ctx: Context) => {
	return await ctx.reply(
		getDayInfo('info', getMenuOptions(ctx)),
		mainButtons()
	)
}
