export const OPERATIONS = [
	[0, 1],
	[0, -1],
	[1, -1],
	[-1, 1],
	[1, 1],
	[-1, -1],
	[1, 0],
	[-1, 0]
];

export const getGridColorScheme = (value: number) => {
	switch (value) {
		case 1:
			return '#ffb703';
		case 2:
			return '#92d293';
		default:
			return undefined;
	}
};
