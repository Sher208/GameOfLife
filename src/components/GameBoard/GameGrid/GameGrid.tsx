import React, { useRef, useCallback } from 'react';
import { CONTROLLER_STATE } from '../Controller/Contoller';
import { getGridColorScheme } from '../GameBoardConstants';
import styles from './GameGrid.module.scss';

type GameGrid = {
	className?: string;
	rowNum?: number;
	columnNum?: number;
	gridWidth?: number;
	gridBorderWidth?: number;
	grid: number[][];
	controllerValue: CONTROLLER_STATE;
	onGridClick: (...args: any) => void;
	onGridSelected?: (
		rectangle: RectangleCoords,
		mouseEvent: MOUSE_EVENTS
	) => void;
};

export type RectangleCoords = {
	x: number;
	y: number;
	w: number;
	h: number;
};

export enum MOUSE_EVENTS {
	UP,
	DOWN,
	MOVE
}

const GameGrid: React.FC<GameGrid> = ({
	columnNum = 10,
	gridWidth = 20,
	gridBorderWidth = 1,
	grid,
	onGridClick,
	onGridSelected = () => {},
	controllerValue
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
			const rect: RectangleCoords = { x: 0, y: 0, w: 0, h: 0 };
			onGridSelected(rect, MOUSE_EVENTS.DOWN);
		}
		drawOnGrid.current.isDrag = true;
		drawOnGrid.current.curX = drawOnGrid.current.startX = i;
		drawOnGrid.current.curY = drawOnGrid.current.startY = j;
	};

	const updateCanvas = useCallback(() => {
		if (drawOnGrid.current.isDrag) {
			const rect: RectangleCoords = {
				x: Math.min(drawOnGrid.current.startX, drawOnGrid.current.curX),
				y: Math.min(drawOnGrid.current.startY, drawOnGrid.current.curY),
				w: Math.abs(
					drawOnGrid.current.curX - drawOnGrid.current.startX
				),
				h: Math.abs(drawOnGrid.current.curY - drawOnGrid.current.startY)
			};
			onGridSelected(rect, MOUSE_EVENTS.MOVE);
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

		const rect: RectangleCoords = {
			x: Math.min(drawOnGrid.current.startX, i),
			y: Math.min(drawOnGrid.current.startY, j),
			w: Math.abs(i - drawOnGrid.current.startX),
			h: Math.abs(j - drawOnGrid.current.startY)
		};
		onGridSelected(rect, MOUSE_EVENTS.UP);
	};

	return (
		<div className={styles.GameGrid__Wrapper}>
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
		</div>
	);
};

export default GameGrid;
