import React, { useMemo } from 'react';
import GameBoard from '../GameBoard/GameBoard';
import SaveDrawer from '../SaveDrawer/SaveDrawer';
import styled from 'styled-components';
import { createGrid } from '../../utils';

const MainWrapper = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
`;

const HomePage: React.FC = () => {
	const ROW_NUMBER = 50;
	const COLUMN_NUMBER = 100;
	const GRID_WIDTH = 20;
	const GRID_BOREDER_WIDTH = 1;

	const createdInitialGrid = useMemo(
		() => createGrid(ROW_NUMBER, COLUMN_NUMBER),
		[]
	);

	return (
		<MainWrapper>
			<SaveDrawer />
			<GameBoard
				initialGrid={createdInitialGrid}
				rowNum={ROW_NUMBER}
				columnNum={COLUMN_NUMBER}
				gridWidth={GRID_WIDTH}
				gridBorderWidth={GRID_BOREDER_WIDTH}
			/>
		</MainWrapper>
	);
};

export default HomePage;
