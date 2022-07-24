import React, { useState } from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CircularIcon from './CircularIcon/CircularIcon';
import { generateRgba } from '../utils';
import { preSetData } from './SaveDrawerConstant';

const drawerWidth = 240;

type SaveDrawerProps = {
	className?: string;
};

export type SavedCellularState = {
	id: number;
	name: string;
	type?: string;
	gridData: number[][];
};

const openedMixin = (theme: Theme): CSSObject => ({
	width: drawerWidth,
	backgroundColor: '#E6EDf5',
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen
	}),
	overflowX: 'hidden',
	overflowY: 'hidden',
	height: `calc(100vh - 60px)`,
	borderBottom: '1px solid #03045e'
});

const closedMixin = (theme: Theme): CSSObject => ({
	top: 0,
	left: 0,
	backgroundColor: '#E6EDf5',
	position: 'absolute',
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen
	}),
	overflowX: 'hidden',
	overflowY: 'hidden',
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up('sm')]: {
		width: `calc(${theme.spacing(8)} + 1px)`
	},
	height: `calc(100vh - 60px)`,
	borderBottom: '1px solid #03045e'
});

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	padding: theme.spacing(0, 1),
	marginTop: '-4px',
	// necessary for content to be below app bar
	...theme.mixins.toolbar
}));

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen
		})
	})
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
	top: 0,
	left: 0,
	position: 'absolute',
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: 'nowrap',
	boxSizing: 'border-box',
	...(open && {
		...openedMixin(theme),
		'& .MuiDrawer-paper': openedMixin(theme)
	}),
	...(!open && {
		...closedMixin(theme),
		'& .MuiDrawer-paper': closedMixin(theme)
	})
}));

const SaveDrawer: React.FC<SaveDrawerProps> = () => {
	const theme = useTheme();
	const [open, setOpen] = useState(false);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [listInfo, setListInfo] = useState<SavedCellularState[]>([
		...preSetData
	]);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	const onDragStart = (
		_event: React.DragEvent<HTMLElement>,
		info: SavedCellularState
	) => {
		_event.dataTransfer?.setData('savedState', JSON.stringify(info));
	};

	return (
		<Box>
			<AppBar
				position="fixed"
				sx={{
					bgcolor: '#f1faee',
					borderColor: 'none',
					height: '60px'
				}}
				open={open}
				elevation={2}
			>
				<Toolbar
					sx={{
						display: 'flex',
						flexDirection: 'row',
						minHeight: '60px'
					}}
				>
					<IconButton
						edge="start"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						sx={{
							color: 'black',
							marginRight: 5,
							minheight: '60px',
							...(open && { display: 'none' })
						}}
					>
						<MenuIcon />
					</IconButton>
					<Typography
						variant="h6"
						component="div"
						sx={{
							color: '#03045e',
							textAlign: 'center',
							width: '100%'
						}}
					>
						Game of Life
					</Typography>
				</Toolbar>
			</AppBar>
			<Drawer variant="permanent" open={open}>
				<DrawerHeader sx={{ bgcolor: '#2A363B' }}>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === 'rtl' ? (
							<ChevronRightIcon sx={{ color: '#f1faee' }} />
						) : (
							<ChevronLeftIcon sx={{ color: '#f1faee' }} />
						)}
					</IconButton>
				</DrawerHeader>
				<List>
					{listInfo.map((info: SavedCellularState) => (
						<ListItem
							draggable
							onDragStart={(e) => onDragStart(e, info)}
							key={info.id}
							disablePadding
							sx={{
								display: 'block',
								bgcolor: `${generateRgba(info.name, 0.2)}`,
								color: 'white',
								top: '-8px'
							}}
						>
							<ListItemButton
								sx={{
									minHeight: 48,
									justifyContent: open ? 'initial' : 'center',
									px: 2.5
								}}
							>
								<ListItemIcon
									sx={{
										minWidth: 0,
										mr: open ? 3 : 'auto',
										justifyContent: 'center'
									}}
								>
									<CircularIcon
										name={info.name}
										color={generateRgba(info.name)}
									/>
								</ListItemIcon>
								<ListItemText
									primary={info.name}
									sx={{
										opacity: open ? 1 : 0,
										color: 'black'
									}}
								/>
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Drawer>
		</Box>
	);
};

export default React.memo(SaveDrawer);
