export const returnReSessionSchedule = (info: [string, string, string][]) =>
	info
		.map(el =>
			[
				`Дата: <u>${el[0] || 'неизвестно'}</u>`,
				`Время: <u>${el[1].replace('.', ':') || 'неизвестно'}</u>`,
				el[2]
			].join('\n')
		)
		.join('\n\n')
