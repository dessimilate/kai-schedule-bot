import { Module } from '@nestjs/common'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'
import { ConfigModule } from '@nestjs/config'
import { session } from 'telegraf'
import { TelegrafModule } from 'nestjs-telegraf'
import { ScheduleModule } from '@nestjs/schedule'
import { Postgres } from '@telegraf/session/pg'
import { AppUpdate } from '@/app.update'
import { PrismaService } from '@/prisma.service'
import { ScheduleModule as ScheduleM } from '@/schedule/schedule.module'
import { NotificationModule } from '@/notification/notification.module'
import { MainMenuService } from '@/bot-services/main-menu.service'
import { ScheduleMenuService } from '@/bot-services/schedule-menu.service'
import { NotificationMenuService } from '@/bot-services/notification-menu.service'
import { ChangeGroupService } from '@/bot-services/change-group.service'
import { FindByLecturersService } from '@/bot-services/find-by-lecturers.service'

const store = Postgres({
	host: process.env.DB_HOST,
	port: +process.env.DB_PORT,
	database: process.env.DB_NAME,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD
})

@Module({
	imports: [
		ConfigModule.forRoot(),
		ScheduleModule.forRoot(),
		TelegrafModule.forRoot({
			middlewares: [session({ store })],
			token: process.env.BOT_TOKEN
		}),
		ScheduleM,
		NotificationModule
	],
	controllers: [AppController],
	providers: [
		AppService,
		AppUpdate,
		PrismaService,
		MainMenuService,
		ScheduleMenuService,
		NotificationMenuService,
		ChangeGroupService,
		FindByLecturersService
	],
	exports: [AppService]
})
export class AppModule {}
