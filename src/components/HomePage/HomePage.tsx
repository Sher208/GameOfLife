import React, { useState } from 'react';
import Controller, { ControllerState } from '../Controller/Contoller';
import GameBoard from '../GameBoard/GameBoard';
import NavBar from '../NavBar/NavBar';
import styles from './HomePage.module.scss';

const HomePage: React.FC = () => {
	const [value, setValue] = useState<ControllerState>(ControllerState.STOP);
	const [nextValue, setNextValue] = useState<number>(0);

	return (
		<div className={styles.HomePage__Grid}>
			<NavBar className={styles.HomePage__NavBarGrid} />
			<GameBoard
				className={styles.HomePage__GameBoard}
				rowNum={20}
				columnNum={20}
				currentState={value}
				nextValueState={nextValue}
			/>
			<Controller
				className={styles.HomePage__Controller}
				value={value}
				onChange={setValue}
				onNextClick={setNextValue}
			/>
		</div>
	);
};

export default HomePage;
