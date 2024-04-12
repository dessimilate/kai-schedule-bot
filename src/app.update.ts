import {
	Action,
	Ctx,
	InjectBot,
	InlineQuery,
	Start,
	Update,
	Hears
} from 'nestjs-telegraf'
import { Telegraf } from 'telegraf'
import { AppService } from '@/app.service'
import { Context } from '@/types/context.interface'
import { closeButton } from '@/buttons/close.button'
import {
	changeGroup,
	evenWeek,
	examList,
	findByLecturers,
	oddWeek,
	reExamList,
	todayList,
	tomorrowList,
	close,
	schedules,
	backToMain,
	notifications,
	offNotifications,
	defaultNotifications,
	beforeLastLesson,
	setNotificationTime
} from '@/constants/buttons-names.constant'
import { MainMenuService } from '@/bot-services/main-menu.service'
import { ScheduleMenuService } from '@/bot-services/schedule-menu.service'
import { NotificationMenuService } from '@/bot-services/notification-menu.service'
import { ChangeGroupService } from '@/bot-services/change-group.service'
import { FindByLecturersService } from '@/bot-services/find-by-lecturers.service'

@Update()
export class AppUpdate {
	constructor(
		@InjectBot() private readonly bot: Telegraf<Context>,
		private readonly appService: AppService,
		private readonly mainMenuService: MainMenuService,
		private readonly scheduleMenuService: ScheduleMenuService,
		private readonly notificationMenuService: NotificationMenuService,
		private readonly changeGroupService: ChangeGroupService,
		private readonly findByLecturersService: FindByLecturersService
	) {}

	/** Main Menu */

	@Start()
	async startBot(@Ctx() ctx: Context) {
		await this.mainMenuService.start(ctx)
	}

	@Action(schedules)
	async displayScheduleMenu(@Ctx() ctx: Context) {
		await this.mainMenuService.displayScheduleMenu(ctx)
	}

	@Action(notifications)
	async displayNotificationMenu(@Ctx() ctx: Context) {
		await this.mainMenuService.displayNotificationMenu(ctx)
	}

	@InlineQuery(new RegExp(`^${changeGroup.trim()}.*`))
	async getByGroup(@Ctx() ctx: Context) {
		await this.mainMenuService.getByGroup(ctx)
	}

	@InlineQuery(new RegExp(`^${findByLecturers.trim()}.*`, 'gi'))
	async getByLecturers(@Ctx() ctx: Context) {
		await this.mainMenuService.getByLecturers(ctx)
	}

	@Action(backToMain)
	async backToMainMenu(@Ctx() ctx: Context) {
		await this.mainMenuService.backToMainMenu(ctx)
	}

	/** Schedule Menu */

	@Action(todayList)
	async getTodaySchedule(@Ctx() ctx: Context) {
		await this.scheduleMenuService.getTodaySchedule(ctx)
	}

	@Action(tomorrowList)
	async getTomorrowSchedule(@Ctx() ctx: Context) {
		await this.scheduleMenuService.getTomorrowSchedule(ctx)
	}

	@Action(evenWeek)
	async getEvenSchedule(@Ctx() ctx: Context) {
		await this.scheduleMenuService.getEvenSchedule(ctx)
	}

	@Action(oddWeek)
	async getOddSchedule(@Ctx() ctx: Context) {
		await this.scheduleMenuService.getOddSchedule(ctx)
	}

	@Action(examList)
	async getSession(@Ctx() ctx: Context) {
		await this.scheduleMenuService.getSession(ctx)
	}

	@Action(reExamList)
	async getReSession(@Ctx() ctx: Context) {
		await this.scheduleMenuService.getReSession(ctx)
	}

	/** Notification Menu */

	@Action(offNotifications)
	async offNotifications(@Ctx() ctx: Context) {
		await this.notificationMenuService.offNotifications(ctx)
	}

	@Action(beforeLastLesson)
	async beforeLastLesson(@Ctx() ctx: Context) {
		await this.notificationMenuService.beforeLastLesson(ctx)
	}

	@Action(defaultNotifications)
	async defaultNotifications(@Ctx() ctx: Context) {
		await this.notificationMenuService.defaultNotifications(ctx)
	}

	@InlineQuery(new RegExp(`^${setNotificationTime.trim()}.*`, 'gi'))
	async changeNotificationTime(@Ctx() ctx: Context) {
		await this.notificationMenuService.changeNotificationTime(ctx)
	}

	@Hears(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
	async setNotificationTime(@Ctx() ctx: Context) {
		await this.notificationMenuService.setNotificationTime(ctx)
	}

	/** Change Group */

	@Hears(new RegExp(`^${changeGroup}([0-9]+)$`))
	async onChangeGroup(@Ctx() ctx: Context) {
		await this.changeGroupService.onChangeGroup(ctx)
	}

	/** Find By Lecturers */

	@Hears(new RegExp(`^${findByLecturers}(.*)$`))
	async findByLecturers(@Ctx() ctx: Context) {
		await this.findByLecturersService.findByLecturers(ctx)
	}

	/** Rest */

	@Action(close)
	async close(@Ctx() ctx: Context) {
		const messageId = ctx.update.callback_query.message.message_id

		try {
			await ctx.deleteMessage(messageId)
		} catch {
			await ctx.editMessageText('тут ничего нет')
		}
	}
}
