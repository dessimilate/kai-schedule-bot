import { notificationType } from '@/types/context.interface'

export const notificationText = (
	time?: string
): Record<notificationType, string> => ({
	off: 'Выключены',
	atTheCertainTime: `В указанное время - ${time}`,
	default: 'По умолчанию - 17:00',
	duringTheLesson: 'Во время пар(в разработке)'
})

export const notificationButtonText = (
	currentType: notificationType = 'off',
	time?: string
): Record<notificationType, string> => ({
	off: currentType === 'off' ? 'Выбрано - Выключено' : 'Выключить',
	atTheCertainTime:
		currentType === 'atTheCertainTime'
			? `Выбрано - В указанное время - ${time}`
			: `В указанное время - ${time}`,
	default:
		(currentType === 'default' ? 'Выбрано - По умолчанию' : 'По умолчанию') +
		' - 17:00',
	duringTheLesson:
		currentType === 'duringTheLesson'
			? 'Выбрано - Во время пар'
			: 'Во время пар'
})
