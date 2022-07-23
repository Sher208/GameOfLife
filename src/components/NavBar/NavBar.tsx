import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

type NavBarProps = {
	className?: string;
};

const NavBar: React.FC<NavBarProps> = () => {
	return (
		<Box sx={{ flexGrow: 1, width: '100%', height: '60px' }}>
			<AppBar
				position="static"
				sx={{
					bgcolor: '#f1faee',
					borderColor: 'none'
				}}
				elevation={0}
			>
				<Toolbar sx={{ justifyContent: 'center' }}>
					<Typography
						variant="h6"
						component="div"
						sx={{ color: '#03045e' }}
					>
						Game of Life
					</Typography>
				</Toolbar>
			</AppBar>
		</Box>
	);
};

export default React.memo(NavBar);
