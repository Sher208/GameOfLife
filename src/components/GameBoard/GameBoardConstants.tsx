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

export const generateRectangleSnippet = (grid: number[][]) => {
	let firstIndex: number[] = [];
	let secondIndex: number[] = [];
	for (let i = 0; i < grid.length; i++) {
		for (let j = 0; j < grid[i].length; j++) {
			if (grid[i][j] === 2) {
				if (firstIndex.length === 0) {
					firstIndex = [i, j];
				}
				if (firstIndex.length === 2) {
					secondIndex = [i, j];
				}
			}
		}
	}
	if (firstIndex.length === 0) {
		return null;
	}
	return grid
		.slice(firstIndex[0], secondIndex[0] + 1)
		.map((i) =>
			i
				.slice(firstIndex[1], secondIndex[1] + 1)
				.map((i) => (i === 2 ? 0 : i))
		);
};

export const convertToCSV = (grid: number[][]) => {
	return grid.map((item) => item.join(',')).join('\n');
};
