import React, { useState } from 'react';
import Controller, { ControllerState } from '../Controller/Contoller';
import GameBoard from '../GameBoard/GameBoard';
import NavBar from '../NavBar/NavBar';
import styles from './HomePage.module.scss';

const HomePage: React.FC = () => {
	const [value, setValue] = useState<number>(ControllerState.STOP);

	return (
		<div className={styles.HomePage__Grid}>
			<NavBar className={styles.HomePage__NavBarGrid} />
			<GameBoard
				className={styles.HomePage__GameBoard}
				rowNum={50}
				columnNum={100}
				currentState={value}
			/>
			<Controller
				className={styles.HomePage__Controller}
				value={value}
				onChange={setValue}
			/>
		</div>
	);
};

export default HomePage;
