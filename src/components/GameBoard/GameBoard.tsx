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
	const [value, setValue] = useState<CONTROLLER_STATE>(
		CONTROLLER_STATE.SNIPPET_SELECTION
	);
	const [nextValue, setNextValue] = useState<number>(0);

	const currentStateRef = useRef(value);
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
			setTimeout(getNextCellularState, 50);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//TODO: Work on this feature
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

	return (
		<div className={styles.GameBoard__Wrapper}>
			<GameGrid
				className={styles.GameBoard__Container}
				columnNum={columnNum}
				gridWidth={gridWidth}
				gridBorderWidth={gridBorderWidth}
				grid={grid}
				controllerValue={value}
				onGridClick={onGridClick}
				onGridSelected={onSaveSelection}
			/>
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
