import {
	Action,
	Ctx,
	InjectBot,
	InlineQuery,
	Start,
	Update,
	Hears,
	Command
} from 'nestjs-telegraf'
import { Telegraf } from 'telegraf'
import { Context } from '@/types/context.interface'
import { BUTTON_NAMES } from '@/constants/buttons-names.constant'
import { MainMenuService } from '@/bot-services/main-menu.service'
import { ScheduleMenuService } from '@/bot-services/schedule-menu.service'
import { NotificationMenuService } from '@/bot-services/notification-menu.service'
import { ChangeGroupService } from '@/bot-services/change-group.service'
import { FindByLecturersService } from '@/bot-services/find-by-lecturers.service'

@Update()
export class AppUpdate {
	constructor(
		private readonly mainMenuService: MainMenuService,
		private readonly scheduleMenuService: ScheduleMenuService,
		private readonly notificationMenuService: NotificationMenuService,
		private readonly changeGroupService: ChangeGroupService,
		private readonly findByLecturersService: FindByLecturersService
	) {}

	// *** MAIN MENU ***

	@Start()
	async startBot(@Ctx() ctx: Context) {
		await this.mainMenuService.start(ctx)
	}

	@Action(BUTTON_NAMES.schedules)
	async displayScheduleMenu(@Ctx() ctx: Context) {
		await this.mainMenuService.displayScheduleMenu(ctx)
	}

	@Action(BUTTON_NAMES.notifications)
	async displayNotificationMenu(@Ctx() ctx: Context) {
		await this.mainMenuService.displayNotificationMenu(ctx)
	}

	@InlineQuery(new RegExp(`^${BUTTON_NAMES.changeGroup.trim()}.*`))
	async getByGroup(@Ctx() ctx: Context) {
		await this.mainMenuService.getByGroup(ctx)
	}

	@InlineQuery(new RegExp(`^${BUTTON_NAMES.findByLecturers.trim()}.*`, 'gi'))
	async getByLecturers(@Ctx() ctx: Context) {
		await this.mainMenuService.getByLecturers(ctx)
	}

	@Action(BUTTON_NAMES.backToMain)
	async backToMainMenu(@Ctx() ctx: Context) {
		await this.mainMenuService.backToMainMenu(ctx)
	}

	// *** SCHEDULE MENU ***

	@Action(BUTTON_NAMES.todayList)
	async getTodaySchedule(@Ctx() ctx: Context) {
		await this.scheduleMenuService.getTodaySchedule(ctx)
	}

	@Action(BUTTON_NAMES.tomorrowList)
	async getTomorrowSchedule(@Ctx() ctx: Context) {
		await this.scheduleMenuService.getTomorrowSchedule(ctx)
	}

	@Action(BUTTON_NAMES.evenWeek)
	async getEvenSchedule(@Ctx() ctx: Context) {
		await this.scheduleMenuService.getEvenSchedule(ctx)
	}

	@Action(BUTTON_NAMES.oddWeek)
	async getOddSchedule(@Ctx() ctx: Context) {
		await this.scheduleMenuService.getOddSchedule(ctx)
	}

	@Action(BUTTON_NAMES.examList)
	async getSession(@Ctx() ctx: Context) {
		await this.scheduleMenuService.getSession(ctx)
	}

	// @Action(reExamList)
	// async getReSession(@Ctx() ctx: Context) {
	// 	await this.scheduleMenuService.getReSession(ctx)
	// }

	// *** COMMANDS ***

	@Command(BUTTON_NAMES.todayCommand)
	async getTodayCommand(@Ctx() ctx: Context) {
		await this.scheduleMenuService.getTodayScheduleCommand(ctx)
	}

	@Command(BUTTON_NAMES.tomorrowCommand)
	async getTomorrowCommand(@Ctx() ctx: Context) {
		await this.scheduleMenuService.getTomorrowScheduleCommand(ctx)
	}

	@Command(BUTTON_NAMES.findByLecturerCommand)
	async findByLecturerCommand(@Ctx() ctx: Context) {
		await this.scheduleMenuService.getTomorrowScheduleCommand(ctx)
	}

	// *** NOTIFICATION MENU ***

	@Action(BUTTON_NAMES.offNotifications)
	async offNotifications(@Ctx() ctx: Context) {
		await this.notificationMenuService.offNotifications(ctx)
	}

	@Action(BUTTON_NAMES.beforeLastLesson)
	async beforeLastLesson(@Ctx() ctx: Context) {
		await this.notificationMenuService.beforeLastLesson(ctx)
	}

	@Action(BUTTON_NAMES.defaultNotifications)
	async defaultNotifications(@Ctx() ctx: Context) {
		await this.notificationMenuService.defaultNotifications(ctx)
	}

	@InlineQuery(
		new RegExp(`^${BUTTON_NAMES.setNotificationTime.trim()}.*`, 'gi')
	)
	async changeNotificationTime(@Ctx() ctx: Context) {
		await this.notificationMenuService.changeNotificationTime(ctx)
	}

	@Hears(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
	async setNotificationTime(@Ctx() ctx: Context) {
		await this.notificationMenuService.setNotificationTime(ctx)
	}

	// *** CHANGE GROUP ***

	@Hears(new RegExp(`^${BUTTON_NAMES.changeGroup}([0-9]+)$`))
	async onChangeGroup(@Ctx() ctx: Context) {
		await this.changeGroupService.onChangeGroup(ctx)
	}

	// *** FIND BY LECTURER ***

	@Hears(new RegExp(`^${BUTTON_NAMES.findByLecturers}(.*)$`))
	async findByLecturers(@Ctx() ctx: Context) {
		await this.findByLecturersService.findByLecturers(ctx)
	}

	// *** REST ***

	@Action(BUTTON_NAMES.close)
	async close(@Ctx() ctx: Context) {
		const messageId = ctx.update.callback_query.message.message_id

		try {
			await ctx.deleteMessage(messageId)
		} catch {
			await ctx.editMessageText('тут ничего нет')
		}
	}
}
