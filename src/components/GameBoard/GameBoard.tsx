import React, { useCallback, useEffect, useState, useRef } from 'react';
import styles from './GameBoard.module.scss';
import { ControllerState } from '../Controller/Contoller';
import produceFunc from 'immer';

const OPERATIONS = [
	[0, 1],
	[0, -1],
	[1, -1],
	[-1, 1],
	[1, 1],
	[-1, -1],
	[1, 0],
	[-1, 0]
];

type GameBoardProps = {
	rowNum?: number;
	columnNum?: number;
	className?: string;
	currentState: number;
};

const getGrid = (rowNum: number, columnNum: number) => {
	const rows = [];
	for (let i = 0; i < rowNum; i++)
		rows.push(Array.from(Array(columnNum), () => 0));
	return rows;
};

const GameBoard = ({
	rowNum = 10,
	columnNum = 10,
	currentState = ControllerState.STOP
}: GameBoardProps) => {
	const [grid, setGrid] = useState(() => getGrid(rowNum, columnNum));
	const currentStateRef = useRef(currentState);
	currentStateRef.current = currentState;

	useEffect(() => {
		currentStateRef.current = ControllerState.PLAY;
		console.log(currentState);
		if (ControllerState.PLAY === currentState) {
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
	}, [currentState]);

	const getNextCellularState = useCallback(() => {
		if (currentStateRef.current != 1) {
			return;
		}

		setGrid((g) => {
			return produceFunc(g, (gridCopy) => {
				for (let i = 0; i < rowNum; i++) {
					for (let k = 0; k < columnNum; k++) {
						let neighbors = 0;
						OPERATIONS.forEach(([x, y]) => {
							const newI = i + x;
							const newK = k + y;
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
							gridCopy[i][k] = 0;
						} else if (g[i][k] === 0 && neighbors === 3) {
							gridCopy[i][k] = 1;
						}
					}
				}
			});
		});
		setTimeout(getNextCellularState, 500);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
							onClick={() =>
								setGrid((grid) =>
									produceFunc(grid, (gridCopy) => {
										gridCopy[i][j] = 1 - gridCopy[i][j];
									})
								)
							}
							aria-hidden="true"
							style={{
								width: 20,
								height: 20,
								backgroundColor: grid[i][j]
									? '#ffb703'
									: undefined,
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
