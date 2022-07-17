import React, { useState } from 'react'
import styles from './Counter.module.scss'

interface Props {
  /**Initalize the counter */
  initialCounter?: number
}

const Counter = ({ initialCounter = 0 }: Props) => {
  const [count, setCount] = useState<number>(initialCounter)

  const onClickHandler = (): void => {
    setCount((c) => c + 1)
  }

  return (
    <div className={styles.Counter_Button}>
      <button onClick={onClickHandler}>Count {count}</button>
    </div>
  )
}

export default Counter
