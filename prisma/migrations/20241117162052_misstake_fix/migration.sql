-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateTable
CREATE TABLE "Board" (
    "course" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "OddWeekSchedule" (
    "date" TEXT NOT NULL,
    "board_course" TEXT NOT NULL,

    CONSTRAINT "OddWeekSchedule_pkey" PRIMARY KEY ("date","board_course")
);

-- CreateTable
CREATE TABLE "EvenWeekSchedule" (
    "date" TEXT NOT NULL,
    "board_course" TEXT NOT NULL,

    CONSTRAINT "EvenWeekSchedule_pkey" PRIMARY KEY ("date","board_course")
);

-- CreateTable
CREATE TABLE "Session" (
    "date" TEXT NOT NULL,
    "board_course" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("date","board_course")
);

-- CreateTable
CREATE TABLE "Resession" (
    "date" TEXT NOT NULL,
    "board_course" TEXT NOT NULL,

    CONSTRAINT "Resession_pkey" PRIMARY KEY ("date","board_course")
);

-- CreateTable
CREATE TABLE "OddScheduleRow" (
    "time" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "lecturer" TEXT NOT NULL,
    "classroom" TEXT NOT NULL,
    "odd_week_schedule_date" TEXT NOT NULL,
    "odd_week_schedule_course" TEXT NOT NULL,

    CONSTRAINT "OddScheduleRow_pkey" PRIMARY KEY ("time","odd_week_schedule_date","odd_week_schedule_course")
);

-- CreateTable
CREATE TABLE "EvenScheduleRow" (
    "time" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "lecturer" TEXT NOT NULL,
    "classroom" TEXT NOT NULL,
    "even_week_schedule_date" TEXT NOT NULL,
    "even_week_schedule_course" TEXT NOT NULL,

    CONSTRAINT "EvenScheduleRow_pkey" PRIMARY KEY ("time","even_week_schedule_date","even_week_schedule_course")
);

-- CreateTable
CREATE TABLE "SessionRow" (
    "time" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "lecturer" TEXT NOT NULL,
    "classroom" TEXT NOT NULL,
    "session_date" TEXT NOT NULL,
    "session_course" TEXT NOT NULL,

    CONSTRAINT "SessionRow_pkey" PRIMARY KEY ("time","session_date","session_course")
);

-- CreateTable
CREATE TABLE "ResessionRow" (
    "time" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "lecturer" TEXT NOT NULL,
    "classroom" TEXT NOT NULL,
    "resession_date" TEXT NOT NULL,
    "resession_course" TEXT NOT NULL,

    CONSTRAINT "ResessionRow_pkey" PRIMARY KEY ("time","resession_date","resession_course")
);

-- CreateTable
CREATE TABLE "Info" (
    "key" TEXT NOT NULL,
    "value" TEXT[]
);

-- CreateTable
CREATE TABLE "LecturersSchedule" (
    "lecturer" TEXT NOT NULL,

    CONSTRAINT "LecturersSchedule_pkey" PRIMARY KEY ("lecturer")
);

-- CreateTable
CREATE TABLE "LecturersScheduleRow" (
    "id" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "classroom" TEXT NOT NULL,

    CONSTRAINT "LecturersScheduleRow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "telegraf-sessions" (
    "key" TEXT NOT NULL,
    "session" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL DEFAULT '',
    "last_name" TEXT NOT NULL DEFAULT '',
    "username" TEXT NOT NULL DEFAULT '',
    "role" "Roles" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LecturersScheduleToLecturersScheduleRow" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Board_course_key" ON "Board"("course");

-- CreateIndex
CREATE UNIQUE INDEX "Info_key_key" ON "Info"("key");

-- CreateIndex
CREATE UNIQUE INDEX "LecturersScheduleRow_time_date_course_key" ON "LecturersScheduleRow"("time", "date", "course");

-- CreateIndex
CREATE UNIQUE INDEX "telegraf-sessions_key_key" ON "telegraf-sessions"("key");

-- CreateIndex
CREATE UNIQUE INDEX "_LecturersScheduleToLecturersScheduleRow_AB_unique" ON "_LecturersScheduleToLecturersScheduleRow"("A", "B");

-- CreateIndex
CREATE INDEX "_LecturersScheduleToLecturersScheduleRow_B_index" ON "_LecturersScheduleToLecturersScheduleRow"("B");

-- AddForeignKey
ALTER TABLE "OddWeekSchedule" ADD CONSTRAINT "OddWeekSchedule_board_course_fkey" FOREIGN KEY ("board_course") REFERENCES "Board"("course") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvenWeekSchedule" ADD CONSTRAINT "EvenWeekSchedule_board_course_fkey" FOREIGN KEY ("board_course") REFERENCES "Board"("course") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_board_course_fkey" FOREIGN KEY ("board_course") REFERENCES "Board"("course") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resession" ADD CONSTRAINT "Resession_board_course_fkey" FOREIGN KEY ("board_course") REFERENCES "Board"("course") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OddScheduleRow" ADD CONSTRAINT "OddScheduleRow_odd_week_schedule_date_odd_week_schedule_co_fkey" FOREIGN KEY ("odd_week_schedule_date", "odd_week_schedule_course") REFERENCES "OddWeekSchedule"("date", "board_course") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvenScheduleRow" ADD CONSTRAINT "EvenScheduleRow_even_week_schedule_date_even_week_schedule_fkey" FOREIGN KEY ("even_week_schedule_date", "even_week_schedule_course") REFERENCES "EvenWeekSchedule"("date", "board_course") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionRow" ADD CONSTRAINT "SessionRow_session_date_session_course_fkey" FOREIGN KEY ("session_date", "session_course") REFERENCES "Session"("date", "board_course") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResessionRow" ADD CONSTRAINT "ResessionRow_resession_date_resession_course_fkey" FOREIGN KEY ("resession_date", "resession_course") REFERENCES "Resession"("date", "board_course") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LecturersScheduleToLecturersScheduleRow" ADD CONSTRAINT "_LecturersScheduleToLecturersScheduleRow_A_fkey" FOREIGN KEY ("A") REFERENCES "LecturersSchedule"("lecturer") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LecturersScheduleToLecturersScheduleRow" ADD CONSTRAINT "_LecturersScheduleToLecturersScheduleRow_B_fkey" FOREIGN KEY ("B") REFERENCES "LecturersScheduleRow"("id") ON DELETE CASCADE ON UPDATE CASCADE;
