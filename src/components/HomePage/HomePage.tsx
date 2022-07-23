import React from 'react';
import GameBoard from '../GameBoard/GameBoard';
import NavBar from '../NavBar/NavBar';
import styles from './HomePage.module.scss';

const HomePage: React.FC = () => {
	const ROW_NUMBER = 50;
	const COLUMN_NUMBER = 100;
	const GRID_WIDTH = 20;
	const GRID_BOREDER_WIDTH = 1;
	return (
		<div className={styles.HomePage__Grid}>
			<NavBar className={styles.HomePage__NavBarGrid} />
			<GameBoard
				className={styles.HomePage__GameBoard}
				rowNum={ROW_NUMBER}
				columnNum={COLUMN_NUMBER}
				gridWidth={GRID_WIDTH}
				gridBorderWidth={GRID_BOREDER_WIDTH}
			/>
		</div>
	);
};

export default HomePage;
