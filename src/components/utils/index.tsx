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
