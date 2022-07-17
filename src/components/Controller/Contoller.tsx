import * as React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { PlayArrow, StopCircle, Replay, SkipNext } from '@mui/icons-material';

type ControllerProps = {
	className?: string;
	value: number;
	onChange: (...args: any) => void;
	onNextClick: (...args: any) => void;
};

export enum ControllerState {
	PLAY = 1,
	STOP = 2,
	RESET = 3,
	SKIPNEXT = 4
}

const Controller: React.FC<ControllerProps> = ({
	value,
	onChange,
	onNextClick
}) => {
	return (
		<BottomNavigation
			showLabels
			value={value}
			sx={{
				height: '100%',
				bgColor: '#f1faee',
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
				value={ControllerState.PLAY}
				style={{ color: '#03045e' }}
				icon={<PlayArrow />}
			/>
			<BottomNavigationAction
				label="Stop"
				value={ControllerState.STOP}
				style={{ color: '#03045e' }}
				icon={<StopCircle />}
			/>
			<BottomNavigationAction
				label="Reset"
				value={ControllerState.RESET}
				style={{ color: '#03045e' }}
				icon={<Replay />}
			/>
			<BottomNavigationAction
				label="Next"
				onClick={() => onNextClick((count: number) => count + 1)}
				value={ControllerState.SKIPNEXT}
				style={{ color: '#03045e' }}
				icon={<SkipNext />}
			/>
		</BottomNavigation>
	);
};

export default Controller;
