import { noClassroom } from '@/constants/classrooms-names.constant'

export const getClassroom = (classroom: string) =>
	`${classroom === noClassroom ? '' : 'в '}<u>${classroom}</u>`
