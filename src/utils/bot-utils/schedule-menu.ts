import { Context } from '@/types/context.interface'
import { getDayInfo } from '@/utils/dayinfo-utils/get-day-info'
import { getMenuOptions } from './get-menu-options'
import { schedulesButtons } from '@/buttons/schedules.buttons'

export const sendScheduleMenu = async (ctx: Context) => {
	const message = await ctx.reply(
		getDayInfo(getMenuOptions(ctx)),
		schedulesButtons()
	)

	ctx.session.start_message_id = message.message_id
}

export const editScheduleMenu = async (ctx: Context) => {
	const message = await ctx.editMessageText(
		getDayInfo(getMenuOptions(ctx)),
		schedulesButtons()
	)

	ctx.session.start_message_id = message['message_id']
}
