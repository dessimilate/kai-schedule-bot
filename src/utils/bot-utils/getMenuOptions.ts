import { Context } from '@/types/context.interface'

export const getMenuOptions = (ctx: Context) => {
	return {
		group: ctx.session.group,
		notification_type: ctx.session.notification_type,
		time: ctx.session.notification_time
	}
}
