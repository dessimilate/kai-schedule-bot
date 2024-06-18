export const getMonthByName = (name: string) => {
	if (name.match(new RegExp('январь', 'gi'))) return 1
	if (name.match(new RegExp('февраль', 'gi'))) return 2
	if (name.match(new RegExp('март', 'gi'))) return 3
	if (name.match(new RegExp('апрель', 'gi'))) return 4
	if (name.match(new RegExp('май', 'gi'))) return 5
	if (name.match(new RegExp('июнь', 'gi'))) return 6
	if (name.match(new RegExp('июль', 'gi'))) return 7
	if (name.match(new RegExp('август', 'gi'))) return 8
	if (name.match(new RegExp('сентябрь', 'gi'))) return 9
	if (name.match(new RegExp('октябрь', 'gi'))) return 10
	if (name.match(new RegExp('ноябрь', 'gi'))) return 11
	if (name.match(new RegExp('декабрь', 'gi'))) return 12
}
