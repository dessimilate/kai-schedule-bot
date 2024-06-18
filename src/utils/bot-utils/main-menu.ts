import { Context } from '@/types/context.interface'
import { getDayInfo } from '@/utils/dayinfo-utils/get-day-info'
import { mainButtons } from '@/buttons/main.buttons'
import { getMenuOptions } from '@/utils/bot-utils/get-menu-options'

export const sendMainMenu = async (ctx: Context) => {
	const message = await ctx.reply(
		getDayInfo(getMenuOptions(ctx)),
		mainButtons()
	)

	ctx.session.start_message_id = message.message_id
}

export const editMainMenu = async (ctx: Context) => {
	const message = await ctx.editMessageText(
		getDayInfo(getMenuOptions(ctx)),
		mainButtons()
	)

	ctx.session.start_message_id = message['message_id']
}
