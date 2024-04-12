import { Context } from '@/types/context.interface'
import { getDayInfo } from '@/utils/dayinfo-utils/getDayInfo'
import { getMenuOptions } from './getMenuOptions'
import { notificationsButtons } from '@/buttons/notification.buttons'

export const sendNotificationMenu = async (ctx: Context) => {
	return await ctx.reply(
		getDayInfo('info', getMenuOptions(ctx)),
		notificationsButtons(ctx.session.notification_type)
	)
}
