import { Context } from '@/types/context.interface'
import { getDayInfo } from '@/utils/dayinfo-utils/get-day-info'
import { firstEntryButtons } from '@/buttons/first-entry.buttons'

export const sendFirstEntryMenu = async (ctx: Context) => {
	const message = await ctx.reply(getDayInfo(), firstEntryButtons())

	ctx.session.start_message_id = message.message_id
}

export const editFirstEntryMenu = async (ctx: Context) => {
	const message = await ctx.editMessageText(getDayInfo(), firstEntryButtons())

	ctx.session.start_message_id = message['message_id']
}
