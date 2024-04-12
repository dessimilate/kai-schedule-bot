import { Context } from '@/types/context.interface'
import { getDayInfo } from '@/utils/dayinfo-utils/getDayInfo'
import { firstEntryButtons } from '@/buttons/first-entry.buttons'

export const sendFirstEntryMenu = async (ctx: Context) => {
	return await ctx.reply(getDayInfo('info'), firstEntryButtons())
}
