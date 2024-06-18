export const textFromTableCell = (cell: HTMLTableCellElement) => {
	return [...cell.querySelectorAll('p')]
		.map(p =>
			[...p.querySelectorAll('span')]
				.map(el => el.textContent.trim())
				.filter(Boolean)
				.join(' ')
		)
		.filter(Boolean)
		.join(' ')
}
