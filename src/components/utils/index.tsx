export const createGrid = (rowNum: number, columnNum: number) => {
	const rows = [];
	for (let i = 0; i < rowNum; i++)
		rows.push(Array.from(Array(columnNum), () => 0));
	return rows;
};

export const checkIfArraysAreEqual = (a: Array<number>, b: Array<number>) => {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false;
	}
	return true;
};

const stringToColor = (string: string) => {
	let hash = 0;
	for (let i = 0; i < string.length; i += 1) {
		hash = string.charCodeAt(i) + ((hash << 5) - hash);
	}
	let color = '#';
	for (let i = 0; i < 3; i += 1) {
		const value = (hash >> (i * 8)) & 0xff;
		color += `00${value.toString(16)}`.slice(-2);
	}
	return color;
};

export const generateRgba = (string: string, alpha = 1) => {
	const hexColor = stringToColor(string);
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
	const rgb = result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
		  }
		: null;

	return rgb
		? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
		: 'rgba(0,0,0,0)';
};
