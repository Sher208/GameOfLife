import React, { useRef, useCallback } from 'react';
import { CONTROLLER_STATE } from '../Controller/Controls';
import { getGridColorScheme } from '../GameBoardConstants';
import styled from 'styled-components';

type GameGrid = {
	className?: string;
	rowNum?: number;
	columnNum?: number;
	gridWidth?: number;
	gridBorderWidth?: number;
	grid: number[][];
	controllerValue: CONTROLLER_STATE;
	handleGridDispatch: (...args: any) => void;
};

export type RectangleCoords = {
	x: number;
	y: number;
	w: number;
	h: number;
};

export enum MOUSE_EVENTS_STATE {
	UP = 'MOUSE_EVENTS_UP',
	DOWN = 'MOUSE_EVENTS_DOWN',
	MOVE = 'MOUSE_EVENTS_MOVE',
	CLICK = 'MOUSE_EVENTS_CLICK',
	DRAG = 'MOUSE_EVENTS_DRAG'
}

const StyledGameGrid = styled.div`
	background-color: #eaeaea;
	border: 2px solid #023047;
	overflow: scroll;
	scroll-behavior: smooth;
	margin-left: 63px;

	&::-webkit-scrollbar {
		width: 4px;
		height: 4px;
	}

	&::-webkit-scrollbar-track {
		border-radius: 2px;
		box-shadow: inset 0 0 6px #000814;
		-webkit-box-shadow: inset 0 0 6px #000814;
	}

	&::-webkit-scrollbar-thumb {
		border-radius: 2px;
		background-color: #ffd60a;
	}
`;

const GameGrid: React.FC<GameGrid> = ({
	rowNum = 10,
	columnNum = 10,
	gridWidth = 20,
	gridBorderWidth = 1,
	grid,
	controllerValue,
	handleGridDispatch
}) => {
	const drawOnGrid = useRef<any>({
		isDrag: false,
		isDirty: false,
		startX: -1,
		startY: -1,
		curX: -1,
		curY: -1
	});

	const enableSnippetSelectionEvent =
		controllerValue === CONTROLLER_STATE.SNIPPET_SELECTION;

	const onMouseDown = (
		_event: React.MouseEvent<HTMLDivElement, MouseEvent>,
		i: number,
		j: number
	) => {
		if (drawOnGrid.current.isDirty) {
			handleGridDispatch({
				type: MOUSE_EVENTS_STATE.DOWN,
				rowNum,
				columnNum
			});
		}
		drawOnGrid.current.isDrag = true;
		drawOnGrid.current.curX = drawOnGrid.current.startX = i;
		drawOnGrid.current.curY = drawOnGrid.current.startY = j;
	};

	const updateCanvas = useCallback(() => {
		if (drawOnGrid.current.isDrag) {
			const rectangle: RectangleCoords = {
				x: Math.min(drawOnGrid.current.startX, drawOnGrid.current.curX),
				y: Math.min(drawOnGrid.current.startY, drawOnGrid.current.curY),
				w: Math.abs(
					drawOnGrid.current.curX - drawOnGrid.current.startX
				),
				h: Math.abs(drawOnGrid.current.curY - drawOnGrid.current.startY)
			};
			handleGridDispatch({
				type: MOUSE_EVENTS_STATE.MOVE,
				rowNum,
				columnNum,
				rectangle
			});
		}
		drawOnGrid.current.isDirty = false;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onMouseMove = (
		_event: React.MouseEvent<HTMLDivElement, MouseEvent>,
		i: number,
		j: number
	) => {
		if (!drawOnGrid.current.isDrag) return;
		if (drawOnGrid.current.isDirty) {
			return;
		}
		drawOnGrid.current.curX = i;
		drawOnGrid.current.curY = j;
		drawOnGrid.current.isDirty = true;
		setTimeout(updateCanvas, 500);
	};

	const onMouseUp = (
		_event: React.MouseEvent<HTMLDivElement, MouseEvent>,
		i: number,
		j: number
	) => {
		drawOnGrid.current.isDrag = false;
		drawOnGrid.current.isDirty = true;

		const rectangle: RectangleCoords = {
			x: Math.min(drawOnGrid.current.startX, i),
			y: Math.min(drawOnGrid.current.startY, j),
			w: Math.abs(i - drawOnGrid.current.startX),
			h: Math.abs(j - drawOnGrid.current.startY)
		};
		handleGridDispatch({
			type: MOUSE_EVENTS_STATE.UP,
			rowNum,
			columnNum,
			rectangle
		});
	};

	const onDrop = (
		_event: React.DragEvent<HTMLDivElement>,
		i: number,
		j: number
	) => {
		const getGrid: string = _event?.dataTransfer?.getData('savedState');
		if (getGrid) {
			const getCelluarGrid: number[][] = JSON.parse(getGrid).gridData;
			handleGridDispatch({
				type: MOUSE_EVENTS_STATE.DRAG,
				rowNum,
				columnNum,
				iIndex: i,
				jIndex: j,
				draggedGridInfo: getCelluarGrid
			});
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
		if (CONTROLLER_STATE.SNIPPET_SELECTION === controllerValue) {
			return;
		}

		if (CONTROLLER_STATE.ERASER === controllerValue) {
			handleGridDispatch({
				type: CONTROLLER_STATE.ERASER,
				rowNum,
				columnNum,
				iIndex: i,
				jIndex: j
			});
		} else {
			handleGridDispatch({
				type: MOUSE_EVENTS_STATE.CLICK,
				rowNum,
				columnNum,
				iIndex: i,
				jIndex: j
			});
		}
	};

	return (
		<StyledGameGrid>
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
								enableSnippetSelectionEvent &&
								onMouseDown(event, i, j)
							}
							onMouseMove={(event) =>
								enableSnippetSelectionEvent &&
								onMouseMove(event, i, j)
							}
							onMouseUp={(event) =>
								enableSnippetSelectionEvent &&
								onMouseUp(event, i, j)
							}
							onDragOver={(e) => e.preventDefault()}
							onDrop={(e) => onDrop(e, i, j)}
							onClick={(event) => onGridClick(event, i, j)}
							aria-hidden="true"
							style={{
								width: gridWidth,
								height: gridWidth,
								backgroundColor: getGridColorScheme(grid[i][j]),
								border: `solid ${gridBorderWidth}px #003566`
							}}
						/>
					))
				)}
			</div>
		</StyledGameGrid>
	);
};

export default GameGrid;
