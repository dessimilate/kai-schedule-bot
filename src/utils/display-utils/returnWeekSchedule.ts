type prop = { [key: string]: [string, string][] }

export const returnWeekSchedule = (info: prop) => {
	const arr = []

	for (const [key, value] of Object.entries(info)) {
		arr.push(
			[
				`<u>${key}</u>`,
				value.length
					? value
							.map(el => [`<i><b>${el[0]}</b></i>`, el[1]].join('\n'))
							.join('\n\n')
					: 'Выходной'
			].join('\n')
		)
	}

	return arr.join('\n\n\n')
}
