"use client"

import styles from './styles.module.scss'

interface TitleProps {
  name01: string;
  name02: string;
}

export function Title({name01, name02}:TitleProps) {

  return (
    <div className={styles.TitleContent}>

      <h1>
        {name02}
      </h1>
      <p>
        {name01}
      </p>
    </div>

  )
}