import React, { useCallback, useEffect, useState, useRef } from 'react';
import styles from './GameBoard.module.scss';
import { ControllerState } from '../Controller/Contoller';
import { OPERATIONS, getGridColorScheme } from './GameBoardConstants';
import { checkIfArraysAreEqual, createGrid } from '../utils';
import produceFunc from 'immer';

type GameBoardProps = {
	rowNum?: number;
	columnNum?: number;
	className?: string;
	currentState: number;
	nextValueState?: number;
};

const GameBoard: React.FC<GameBoardProps> = ({
	rowNum = 10,
	columnNum = 10,
	currentState = ControllerState.STOP,
	nextValueState = 0
}) => {
	const [grid, setGrid] = useState(() => createGrid(rowNum, columnNum));

	const currentStateRef = useRef(currentState);
	const gridToSave = useRef<any>({
		gridFilled: false,
		mouseUp: {
			currentXCoords: null,
			currentXGridCoords: null
		},
		mouseDown: {
			currentYCoords: null,
			currentYGridCoords: null
		}
	});

	useEffect(() => {
		currentStateRef.current = currentState;
		if (
			ControllerState.PLAY === currentState ||
			ControllerState.SKIPNEXT === currentState
		) {
			getNextCellularState();
		} else if (ControllerState.RESET === currentState) {
			setGrid((grid) =>
				produceFunc(grid, (gridCopy) => {
					for (let i = 0; i < rowNum; i++) {
						for (let j = 0; j < columnNum; j++) {
							gridCopy[i][j] = 0;
						}
					}
				})
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentState, nextValueState]);

	const getNextCellularState = useCallback(() => {
		if (
			currentStateRef.current === ControllerState.STOP ||
			currentStateRef.current === ControllerState.RESET
		) {
			return;
		}

		setGrid((g) => {
			return produceFunc(g, (gridCopy) => {
				for (let i = 0; i < rowNum; i++) {
					for (let j = 0; j < columnNum; j++) {
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
								neighbors += g[newI][newK];
							}
						});

						if (neighbors < 2 || neighbors > 3) {
							gridCopy[i][j] = 0;
						} else if (g[i][j] === 0 && neighbors === 3) {
							gridCopy[i][j] = 1;
						}
					}
				}
			});
		});

		if (currentStateRef.current === ControllerState.PLAY) {
			setTimeout(getNextCellularState, 100);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSaveSelection = (
		_event: React.MouseEvent<HTMLDivElement, MouseEvent>,
		i: number,
		j: number
	) => {
		const gridToSaveCopy = { ...gridToSave.current };
		if (_event.type === 'mouseup') {
			gridToSaveCopy.mouseUp.currentXGridCoords = [i, j];
		} else if (_event.type === 'mousedown') {
			gridToSaveCopy.mouseDown.currentYGridCoords = [i, j];
		}
		if (
			gridToSaveCopy.mouseUp.currentXGridCoords &&
			gridToSaveCopy.mouseDown.currentYGridCoords &&
			!checkIfArraysAreEqual(
				gridToSaveCopy.mouseUp.currentXGridCoords,
				gridToSaveCopy.mouseDown.currentYGridCoords
			)
		) {
			const [firstRow, firstColumn] =
				gridToSaveCopy.mouseUp.currentXGridCoords;
			const [secondRow, secondColumn] =
				gridToSaveCopy.mouseDown.currentYGridCoords;
			setGrid((grid) =>
				produceFunc(grid, (gridCopy) => {
					for (let i = firstRow; i < secondRow; i++) {
						for (let j = firstColumn; j < secondColumn; j++) {
							if (gridCopy[i][j] !== 1) {
								gridCopy[i][j] = 2;
							}
						}
					}
				})
			);
			gridToSaveCopy.gridFilled = true;
		}
		gridToSave.current = gridToSaveCopy;
	};

	return (
		<div className={styles.GameBoard__Container}>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: `repeat(${columnNum}, 21px)`
				}}
			>
				{grid.map((rows, i) =>
					rows.map((col, j) => (
						<div
							key={`${i}_${j}`}
							onMouseDown={(event) =>
								onSaveSelection(event, i, j)
							}
							onMouseUp={(event) => onSaveSelection(event, i, j)}
							onClick={() =>
								setGrid((grid) =>
									produceFunc(grid, (gridCopy) => {
										gridCopy[i][j] =
											gridCopy[i][j] === 1 ? 0 : 1;
									})
								)
							}
							aria-hidden="true"
							style={{
								width: 20,
								height: 20,
								backgroundColor: getGridColorScheme(grid[i][j]),
								border: 'solid 1px #003566'
							}}
						/>
					))
				)}
			</div>
		</div>
	);
};

export default GameBoard;
