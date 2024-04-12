export const returnDaySchedule = (info: [string, [string, string][]]) =>
	`<u>${info[0]}</u>\n${info[1]
		.filter(el => el[0] && el[1])
		.map(el => [`<i><b>${el[0]}</b></i>`, el[1]].join('\n'))
		.join('\n\n')}`
