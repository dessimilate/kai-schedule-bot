import { Context } from '@/types/context.interface'
import { getDayInfo } from '@/utils/dayinfo-utils/get-day-info'
import { getMenuOptions } from './get-menu-options'
import { notificationsButtons } from '@/buttons/notification.buttons'

export const sendNotificationMenu = async (ctx: Context) => {
	const message = await ctx.reply(
		getDayInfo(getMenuOptions(ctx)),
		notificationsButtons(ctx.session)
	)

	ctx.session.start_message_id = message.message_id
}

export const editNotificationMenu = async (ctx: Context) => {
	const message = await ctx.editMessageText(
		getDayInfo(getMenuOptions(ctx)),
		notificationsButtons(ctx.session)
	)

	ctx.session.start_message_id = message['message_id']
}
