import {
	ClearAll,
	ContentCut,
	PlayArrow,
	Replay,
	Save,
	SkipNext,
	StopCircle
} from '@mui/icons-material';

export enum CONTROLLER_STATE {
	PLAY = 'CONTROLLER_PLAY',
	STOP = 'CONTROLLER_STOP',
	RESET = 'CONTROLLER_RESET',
	SKIPNEXT = 'CONTROLLER_SKIPNEXT',
	CLEAR_SELECTION = 'CONTROLLER_CLEAR_SELECTION',
	SNIPPET_SELECTION = 'CONTROLLER_SNIPPET_SELECTION',
	ERASER = 'CONTROLLER_ERASER',
	SAVE = 'CONTROLLER_SAVE'
}

export const ControllerConstants = {
	SIDE_CONTROLLER: [
		{
			id: 1,
			name: 'Snippet Selection',
			value: CONTROLLER_STATE.SNIPPET_SELECTION,
			icon: ContentCut,
			updateState: true
		},
		{
			id: 3,
			name: 'Save',
			value: CONTROLLER_STATE.SAVE,
			icon: Save,
			updateState: false
		},
		{
			id: 2,
			name: 'Clear All',
			value: CONTROLLER_STATE.CLEAR_SELECTION,
			icon: ClearAll,
			updateState: false
		}
	],
	BOTTOM_CONTROLLER: [
		{
			id: 1,
			name: 'Play',
			value: CONTROLLER_STATE.PLAY,
			icon: PlayArrow,
			updateState: true
		},
		{
			id: 2,
			name: 'Stop',
			value: CONTROLLER_STATE.STOP,
			icon: StopCircle,
			updateState: true
		},
		{
			id: 3,
			name: 'Next',
			value: CONTROLLER_STATE.SKIPNEXT,
			icon: SkipNext
		},
		{
			id: 4,
			name: 'Reset',
			value: CONTROLLER_STATE.RESET,
			icon: Replay
		}
	]
};
