import * as React from 'react';
import { List, ListItem, ListItemButton, ListItemIcon } from '@mui/material';
import { ContentCut } from '@mui/icons-material';
import { CONTROLLER_STATE } from '../Controller/Contoller';

type SideBarControllerProps = {
	className?: string;
	color?: string;
};

const SideBarController: React.FC<SideBarControllerProps> = ({ className }) => {
	const SideBarControllerConstant = [
		{
			id: 1,
			name: 'Snippet Selection',
			value: CONTROLLER_STATE.SNIPPET_SELECTION,
			icon: ContentCut
		}
	];
	return (
		<List className={className}>
			{SideBarControllerConstant.map((info) => (
				<ListItem
					key={info.id}
					disablePadding
					sx={{
						display: 'block',
						color: 'white',
						top: '-8px'
					}}
				>
					<ListItemButton
						sx={{
							minHeight: 48,
							px: 2.5
						}}
					>
						<ListItemIcon
							sx={{
								minWidth: 0,
								justifyContent: 'center'
							}}
						>
							{/* {info.icon} */}
						</ListItemIcon>
					</ListItemButton>
				</ListItem>
			))}
		</List>
	);
};

export default SideBarController;
