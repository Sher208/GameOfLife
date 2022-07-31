import * as React from 'react';
import { List, ListItem, SvgIcon } from '@mui/material';
import { ControllerConstants, CONTROLLER_STATE } from './Controls';
import CustomButton from '../../../common/CustomButton';
import styled from 'styled-components';

type BottomCOntrollerProps = {
	className?: string;
	controllerValue: CONTROLLER_STATE;
	handleControllerValue: (...args: any) => void;
};

const StyledListItem = styled(ListItem)`
	display: flex;
	flex-direction: row;
	justify-content: center !important;
	align-items: center;
	margin: 20px;
	width: fit-content !important;
	color: white;
`;

const StyledCustomButton = styled(CustomButton)`
	width: fit-content;
	border-radius: 10px;
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

const BottomController: React.FC<BottomCOntrollerProps> = ({
	className,
	controllerValue,
	handleControllerValue
}) => {
	return (
		<List className={className}>
			{ControllerConstants['BOTTOM_CONTROLLER'].map(
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

export default BottomController;
