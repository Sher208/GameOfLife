import * as React from 'react';
import Avatar from '@mui/material/Avatar';

type CircularIconProps = {
	name: string;
	color?: string;
};

const generateText = (string: string) => {
	const firstString = string.split(' ')[0][0];
	const secondString = string.split(' ')[0][1];
	if (firstString && secondString) {
		return `${firstString}${secondString}`;
	}
	return `${firstString}`;
};

const CircularIcon: React.FC<CircularIconProps> = ({ name = 'DF', color }) => {
	return (
		<Avatar
			sx={{
				bgcolor: color,
				color: 'black',
				border: '1px solid grey'
			}}
		>
			{generateText(name)}
		</Avatar>
	);
};

export default CircularIcon;
