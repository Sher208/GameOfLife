import React, { useCallback, useEffect, useState, useRef } from 'react';
import styles from './GameBoard.module.scss';
import Controller, { CONTROLLER_STATE } from './Controller/Contoller';
import {
	generateRectangleSnippet,
	OPERATIONS,
	convertToCSV
} from './GameBoardConstants';
import { createGrid } from '../utils';
import produceFunc from 'immer';
import GameGrid, { MOUSE_EVENTS, RectangleCoords } from './GameGrid/GameGrid';
import { SavedCellularState } from '../SaveDrawer/SaveDrawer';
// import SideBarController from './SideBarController/SideBarController';

type GameBoardProps = {
	rowNum?: number;
	columnNum?: number;
	className?: string;
	gridWidth?: number;
	gridBorderWidth?: number;
};

const GameBoard: React.FC<GameBoardProps> = ({
	rowNum = 10,
	columnNum = 10,
	gridWidth = 20,
	gridBorderWidth = 1
}) => {
	const [grid, setGrid] = useState(() => createGrid(rowNum, columnNum));
	const [value, setValue] = useState<CONTROLLER_STATE>(CONTROLLER_STATE.STOP);
	const [nextValue, setNextValue] = useState<number>(0);

	const currentStateRef = useRef(value);
	const timerRef = useRef<number | undefined>(undefined);
	currentStateRef.current = value;

	useEffect(() => {
		switch (value) {
			case CONTROLLER_STATE.PLAY:
			case CONTROLLER_STATE.SKIPNEXT:
				getNextCellularState();
				break;
			case CONTROLLER_STATE.RESET:
				setGrid((grid) =>
					produceFunc(grid, (gridCopy) => {
						for (let i = 0; i < rowNum; i++) {
							for (let j = 0; j < columnNum; j++) {
								gridCopy[i][j] = 0;
							}
						}
					})
				);
				break;
			case CONTROLLER_STATE.CLEAR_SELECTION:
				setGrid((grid) =>
					produceFunc(grid, (gridCopy) => {
						for (let i = 0; i < rowNum; i++) {
							for (let j = 0; j < columnNum; j++) {
								if (grid[i][j] === 2) {
									gridCopy[i][j] = 0;
								}
							}
						}
					})
				);
				break;
			default:
				break;
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, nextValue]);

	const getNextCellularState = useCallback(() => {
		if (
			currentStateRef.current === CONTROLLER_STATE.STOP ||
			currentStateRef.current === CONTROLLER_STATE.RESET
		) {
			clearTimeout(timerRef.current);
			return;
		}

		setGrid((g) => {
			return produceFunc(g, (gridCopy) => {
				for (let i = 0; i < rowNum; i++) {
					for (let j = 0; j < columnNum; j++) {
						if (g[i][j] === 2) {
							gridCopy[i][j] = 0;
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
								if (g[newI][newK] === 1) {
									neighbors += 1;
								}
							}
						});

						if (neighbors < 2 || neighbors > 3) {
							gridCopy[i][j] = 0;
						} else if (
							(g[i][j] === 0 || g[i][j] === 2) &&
							neighbors === 3
						) {
							gridCopy[i][j] = 1;
						}
					}
				}
			});
		});

		if (currentStateRef.current === CONTROLLER_STATE.PLAY) {
			timerRef.current = window.setTimeout(getNextCellularState, 50);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onSaveSelection = (
		rectangle: RectangleCoords,
		mouseEvent: MOUSE_EVENTS
	) => {
		const { x, y, w, h } = rectangle;

		if (mouseEvent === MOUSE_EVENTS.DOWN) {
			setGrid((grid) =>
				produceFunc(grid, (gridCopy) => {
					for (let i = 0; i < rowNum; i++) {
						for (let j = 0; j < columnNum; j++) {
							if (gridCopy[i][j] === 2) {
								gridCopy[i][j] = 0;
							}
						}
					}
				})
			);
		} else {
			setGrid((grid) =>
				produceFunc(grid, (gridCopy) => {
					for (let i = x; i < x + w; i++) {
						for (let j = y; j < y + h; j++) {
							if (gridCopy[i][j] !== 1) {
								gridCopy[i][j] = 2;
							}
						}
					}
				})
			);
		}
	};

	/**
	 * @param _event React Mouse event
	 * @param i Grid i index
	 * @param j Grid j Index
	 */
	const onGridClick = (
		_event: React.MouseEvent<HTMLDivElement, MouseEvent>,
		i: number,
		j: number
	) => {
		if (CONTROLLER_STATE.SNIPPET_SELECTION === value) {
			return;
		}

		if (CONTROLLER_STATE.ERASER === value) {
			setGrid((grid) =>
				produceFunc(grid, (gridCopy) => {
					gridCopy[i][j] = gridCopy[i][j] === 1 ? 0 : gridCopy[i][j];
				})
			);
		} else {
			setGrid((grid) =>
				produceFunc(grid, (gridCopy) => {
					gridCopy[i][j] = gridCopy[i][j] === 1 ? 0 : 1;
				})
			);
		}
	};

	const onSaveClick = () => {
		const selectedArray = generateRectangleSnippet(grid);
		if (selectedArray) {
			console.log(selectedArray);
			const convertToCsvValue: string = convertToCSV(selectedArray);
			const element = document.createElement('a');
			const textFile = new Blob([convertToCsvValue], {
				type: 'text/plain'
			});
			element.href = URL.createObjectURL(textFile);
			element.download = 'snipper.gof.txt';
			document.body.appendChild(element);
			element.click();
		}
	};

	const onDragDrop = (
		selectedCellularState: SavedCellularState,
		i: number,
		j: number
	) => {
		const gridInfo: number[][] = selectedCellularState.gridData;
		const getGridCenterCoords = [
			Math.ceil(gridInfo.length / 2),
			Math.ceil(gridInfo[0].length / 2)
		];

		console.log(gridInfo, getGridCenterCoords, i, j);

		setGrid((grid) =>
			produceFunc(grid, (gridCopy) => {
				let currI = 0;
				let currJ = 0;
				for (
					let x = i - getGridCenterCoords[0];
					x < i + getGridCenterCoords[0] + 1;
					x++
				) {
					currJ = 0;
					for (
						let y = j - getGridCenterCoords[1];
						y < j + getGridCenterCoords[1] + 1;
						y++
					) {
						if (
							x >= 0 &&
							x < rowNum &&
							y >= 0 &&
							y < columnNum &&
							gridInfo.length > currI &&
							gridInfo[0].length > currJ
						) {
							gridCopy[x][y] = gridInfo[currI][currJ];
							currJ = currJ + 1;
						}
					}
					currI = currI + 1;
				}
			})
		);
	};

	return (
		<div className={styles.GameBoard__Wrapper}>
			<GameGrid
				className={styles.GameBoard__Container}
				columnNum={columnNum}
				gridWidth={gridWidth}
				gridBorderWidth={gridBorderWidth}
				grid={grid}
				controllerValue={value}
				onDragDrop={onDragDrop}
				onGridClick={onGridClick}
				onGridSelected={onSaveSelection}
			/>
			{/* <SideBarController
				className={styles.GameBoard__SideBarController}
			/> */}
			<Controller
				className={styles.GameBoard__Controller}
				value={value}
				onChange={setValue}
				onNextClick={setNextValue}
				onSaveClick={onSaveClick}
			/>
		</div>
	);
};

export default GameBoard;
