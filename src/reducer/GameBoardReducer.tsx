import { Reducer } from 'react';
import produceFunc from 'immer';
import { CONTROLLER_STATE } from '../components/GameBoard/Controller/Controls';
import { OPERATIONS } from '../components/GameBoard/GameBoardConstants';
import {
	MOUSE_EVENTS_STATE,
	RectangleCoords
} from '../components/GameBoard/GameGrid/GameGrid';

export type GameBoardImmerReducerActions = {
	type: CONTROLLER_STATE | MOUSE_EVENTS_STATE;
	rowNum: number;
	columnNum: number;
	rectangle?: RectangleCoords;
	iIndex?: number;
	jIndex?: number;
	draggedGridInfo?: number[][];
};

export const GameBoardImmerReducer: Reducer<
	number[][],
	GameBoardImmerReducerActions
> = (state, action) => {
	const {
		type,
		rowNum,
		columnNum,
		rectangle = { x: 0, y: 0, h: 0, w: 0 },
		iIndex = 0,
		jIndex = 0,
		draggedGridInfo = [[]]
	} = action;
	return produceFunc(state, (draft: any) => {
		switch (type) {
			case CONTROLLER_STATE.RESET:
				for (let i = 0; i < rowNum; i++) {
					for (let j = 0; j < columnNum; j++) {
						draft[i][j] = 0;
					}
				}
				break;
			case CONTROLLER_STATE.CLEAR_SELECTION:
				for (let i = 0; i < rowNum; i++) {
					for (let j = 0; j < columnNum; j++) {
						if (state[i][j] === 2) {
							draft[i][j] = 0;
						}
					}
				}
				break;
			case CONTROLLER_STATE.SKIPNEXT:
				for (let i = 0; i < rowNum; i++) {
					for (let j = 0; j < columnNum; j++) {
						if (state[i][j] === 2) {
							draft[i][j] = 0;
						}
						let neighbors = 0;
						OPERATIONS.forEach(([x, y]) => {
							const newI = i + x;
							const newK = j + y;
							if (
								newI >= 0 &&
								newI < rowNum &&
								newK >= 0 &&
								newK < columnNum
							) {
								if (state[newI][newK] === 1) {
									neighbors += 1;
								}
							}
						});

						if (neighbors < 2 || neighbors > 3) {
							draft[i][j] = 0;
						} else if (
							(state[i][j] === 0 || state[i][j] === 2) &&
							neighbors === 3
						) {
							draft[i][j] = 1;
						}
					}
				}
				break;
			case CONTROLLER_STATE.ERASER:
				draft[iIndex][jIndex] =
					draft[iIndex][jIndex] === 1 ? 0 : draft[iIndex][jIndex];
				break;
			case MOUSE_EVENTS_STATE.CLICK:
				draft[iIndex][jIndex] = draft[iIndex][jIndex] === 1 ? 0 : 1;
				break;
			case MOUSE_EVENTS_STATE.DOWN:
			case MOUSE_EVENTS_STATE.MOVE:
				for (let i = 0; i < rowNum; i++) {
					for (let j = 0; j < columnNum; j++) {
						if (draft[i][j] === 2) {
							draft[i][j] = 0;
						}
					}
				}
				break;
			case MOUSE_EVENTS_STATE.UP:
				const { x, y, w, h } = rectangle;
				for (let i = x; i < x + w; i++) {
					for (let j = y; j < y + h; j++) {
						if (draft[i][j] !== 1) {
							draft[i][j] = 2;
						}
					}
				}
				break;
			case MOUSE_EVENTS_STATE.DRAG:
				let currI = 0;
				let currJ = 0;
				const getGridCenterCoords = [
					Math.ceil(draggedGridInfo.length / 2),
					Math.ceil(draggedGridInfo[0].length / 2)
				];
				for (
					let x = iIndex - getGridCenterCoords[0];
					x < iIndex + getGridCenterCoords[0] + 1;
					x++
				) {
					currJ = 0;
					for (
						let y = jIndex - getGridCenterCoords[1];
						y < jIndex + getGridCenterCoords[1] + 1;
						y++
					) {
						if (
							x >= 0 &&
							x < rowNum &&
							y >= 0 &&
							y < columnNum &&
							draggedGridInfo.length > currI &&
							draggedGridInfo[0].length > currJ
						) {
							draft[x][y] = draggedGridInfo[currI][currJ];
							currJ = currJ + 1;
						}
					}
					currI = currI + 1;
				}
				console.log('Draft', draft);
				break;
			default:
				break;
		}
	});
};
