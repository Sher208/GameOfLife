import React, { useCallback, useState, useRef, useReducer } from 'react';
import styles from './GameBoard.module.scss';
import BottomController from './Controller/BottomContoller';
import { CONTROLLER_STATE } from './Controller/Controls';
import { generateRectangleSnippet, convertToCSV } from '../../utils';
import GameGrid from './GameGrid/GameGrid';
import SideBarController from './Controller/SideController';
import { GameBoardImmerReducer } from '../../reducer/GameBoardReducer';

type GameBoardProps = {
	initialGrid: number[][];
	rowNum?: number;
	columnNum?: number;
	className?: string;
	gridWidth?: number;
	gridBorderWidth?: number;
};

const onSaveClick = (grid: number[][]) => {
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

const GameBoard: React.FC<GameBoardProps> = ({
	initialGrid,
	rowNum = 10,
	columnNum = 10,
	gridWidth = 20,
	gridBorderWidth = 1
}) => {
	const [grid, setGridDispatch] = useReducer(
		GameBoardImmerReducer,
		initialGrid
	);

	const [value, setValue] = useState<CONTROLLER_STATE>(CONTROLLER_STATE.STOP);

	const currentStateRef = useRef(value);
	const timerRef = useRef<number | undefined>(undefined);
	currentStateRef.current = value;

	const getNextCellularState = useCallback(() => {
		if (
			currentStateRef.current === CONTROLLER_STATE.STOP ||
			currentStateRef.current === CONTROLLER_STATE.RESET
		) {
			clearTimeout(timerRef.current);
			return;
		}
		setGridDispatch({ type: CONTROLLER_STATE.SKIPNEXT, rowNum, columnNum });
		if (currentStateRef.current === CONTROLLER_STATE.PLAY) {
			timerRef.current = window.setTimeout(getNextCellularState, 50);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleControllerValue = (
		e: Event,
		controllerValue: CONTROLLER_STATE,
		updateState: boolean
	) => {
		setGridDispatch({
			type: controllerValue,
			rowNum,
			columnNum
		});
		if (updateState) {
			setValue(controllerValue);
		}
		if (controllerValue === CONTROLLER_STATE.SAVE) {
			onSaveClick(grid);
		} else if (controllerValue === CONTROLLER_STATE.PLAY) {
			currentStateRef.current = CONTROLLER_STATE.PLAY;
			getNextCellularState();
		}
	};

	return (
		<div className={styles.GameBoard__Wrapper}>
			<GameGrid
				className={styles.GameBoard__Container}
				grid={grid}
				rowNum={rowNum}
				columnNum={columnNum}
				gridWidth={gridWidth}
				gridBorderWidth={gridBorderWidth}
				controllerValue={value}
				handleGridDispatch={setGridDispatch}
			/>
			<SideBarController
				className={styles.GameBoard__SideController}
				controllerValue={value}
				handleControllerValue={handleControllerValue}
			/>
			<BottomController
				className={styles.GameBoard__BottomController}
				controllerValue={value}
				handleControllerValue={handleControllerValue}
			/>
		</div>
	);
};

export default GameBoard;
