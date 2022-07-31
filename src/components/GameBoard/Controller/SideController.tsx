import * as React from 'react';
import { List, ListItem, SvgIcon } from '@mui/material';
import { ControllerConstants, CONTROLLER_STATE } from './Controls';
import CustomButton from '../../../common/CustomButton';
import styled from 'styled-components';

type SideBarControllerProps = {
	className?: string;
	controllerValue?: CONTROLLER_STATE;
	handleControllerValue: (...args: any) => void;
};

const StyledListItem = styled(ListItem)`
	color: white;
	margin: 6px;
`;

const StyledCustomButton = styled(CustomButton)`
	border-radius: 50%;
	padding: 10px;
	background-color: ${(props) => (props.isSelected ? '#9e2a2b' : 'white')};
	color: ${(props) => (props.isSelected ? 'white' : 'black')};
	cursor: pointer;
	border: none;
	box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
	&:hover {
		background-color: black;
		color: white;
	}
`;

const SideBarController: React.FC<SideBarControllerProps> = ({
	className,
	controllerValue,
	handleControllerValue
}) => {
	return (
		<List className={className}>
			{ControllerConstants['SIDE_CONTROLLER'].map(
				({ id, value, icon, updateState }) => (
					<StyledListItem key={id} disablePadding>
						<StyledCustomButton
							isSelected={controllerValue === value}
							onClick={(e) =>
								handleControllerValue(e, value, updateState)
							}
						>
							<SvgIcon component={icon} />
						</StyledCustomButton>
					</StyledListItem>
				)
			)}
		</List>
	);
};

export default SideBarController;
