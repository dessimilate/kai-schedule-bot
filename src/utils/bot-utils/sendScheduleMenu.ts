import { Context } from '@/types/context.interface'
import { getDayInfo } from '@/utils/dayinfo-utils/getDayInfo'
import { getMenuOptions } from './getMenuOptions'
import { schedulesButtons } from '@/buttons/schedules.buttons'

export const sendScheduleMenu = async (ctx: Context) => {
	return await ctx.reply(
		getDayInfo('info', getMenuOptions(ctx)),
		schedulesButtons()
	)
}
