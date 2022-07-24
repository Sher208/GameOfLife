import * as React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import {
	PlayArrow,
	StopCircle,
	Replay,
	SkipNext,
	Clear,
	TextSnippet,
	LayersClear,
	Save
} from '@mui/icons-material';

type ControllerProps = {
	className?: string;
	value: number;
	onChange: (...args: any) => void;
	onNextClick: (...args: any) => void;
	onSaveClick?: (...args: any) => void;
};

export enum CONTROLLER_STATE {
	PLAY = 1,
	STOP = 2,
	RESET = 3,
	SKIPNEXT = 4,
	CLEAR_SELECTION = 5,
	SNIPPET_SELECTION = 6,
	ERASER = 7,
	SAVE = 8
}

const Controller: React.FC<ControllerProps> = ({
	value,
	onChange,
	onNextClick,
	onSaveClick
}) => {
	return (
		<BottomNavigation
			showLabels
			value={value}
			sx={{
				backgroundColor: '#f9f4f4',
				transition: 'none',
				'& .MuiSvgIcon-root': {
					color: '#ffd60a'
				},
				'& .MuiBottomNavigationAction-label': {
					color: '#003566'
				},
				'& .Mui-selected': {
					'& .MuiBottomNavigationAction-label': {
						fontSize: (theme) => theme.typography.caption,
						transition: 'none',
						fontWeight: 'bold',
						lineHeight: '20px'
					},
					'& .MuiSvgIcon-root, & .MuiBottomNavigationAction-label': {
						color: '#9e2a2b'
					}
				}
			}}
			onChange={(event, newValue) => onChange(newValue)}
		>
			<BottomNavigationAction
				label="Play"
				value={CONTROLLER_STATE.PLAY}
				style={{ color: '#03045e' }}
				icon={<PlayArrow />}
			/>
			<BottomNavigationAction
				label="Stop"
				value={CONTROLLER_STATE.STOP}
				style={{ color: '#03045e' }}
				icon={<StopCircle />}
			/>
			<BottomNavigationAction
				label="Erase"
				value={CONTROLLER_STATE.ERASER}
				style={{ color: '#03045e' }}
				icon={<LayersClear />}
			/>
			<BottomNavigationAction
				label="Next"
				onClick={() => onNextClick((count: number) => count + 1)}
				value={CONTROLLER_STATE.SKIPNEXT}
				style={{ color: '#03045e' }}
				icon={<SkipNext />}
			/>
			<BottomNavigationAction
				label="Reset"
				value={CONTROLLER_STATE.RESET}
				style={{ color: '#03045e' }}
				icon={<Replay />}
			/>
			<BottomNavigationAction
				label="Snippet Selection"
				value={CONTROLLER_STATE.SNIPPET_SELECTION}
				style={{ color: '#03045e' }}
				icon={<TextSnippet />}
			/>
			<BottomNavigationAction
				label="Clear Snippet"
				value={CONTROLLER_STATE.CLEAR_SELECTION}
				style={{ color: '#03045e' }}
				icon={<Clear />}
			/>
			<BottomNavigationAction
				label="Save"
				onClick={onSaveClick}
				value={CONTROLLER_STATE.SAVE}
				style={{ color: '#03045e' }}
				icon={<Save />}
			/>
		</BottomNavigation>
	);
};

export default Controller;
