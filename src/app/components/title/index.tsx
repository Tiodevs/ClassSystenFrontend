"use client"

import styles from './styles.module.scss'

interface TitleProps {
  name01: string;
  name02: string;
}

export function Title({name01, name02}:TitleProps) {

  return (
    <div className={styles.TitleContent}>

      <h2>
        {name01}
      </h2>
      <h1>
        {name02}
      </h1>
    </div>

  )
}