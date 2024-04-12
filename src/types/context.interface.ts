import { Context as ContextT } from 'telegraf'
import { Chat, Update } from 'telegraf/typings/core/types/typegram'

export type ntType = 'off' | 'default' | 'duringTheLesson' | 'atTheCertainTime'
export type menuBtnType = 'main' | 'schedules' | 'notification'

export type sessionType = {
	update_id: number
	group: string
	start_message_id: number
	first_name: string
	last_name: string
	notification_type: ntType
	menu_button_type: menuBtnType
	notification_time: [number, number]
}

export interface Context extends ContextT {
	session: sessionType

	update: Update & {
		chosen_inline_result: {
			from: {
				id: number
			}
			query: string
			result_id: number
		}
		callback_query: {
			message: {
				message_id: number
			}
			from: {
				id: number
			}
		}
		message: {
			chat: {
				id: number
			}
		}
	} & {
		message: {
			message_id: number
		}
	}

	chat: Chat & {
		first_name?: string
		last_name?: string
		username?: string
	}

	match: string[]
}
