import React from 'react';
import cx from 'classnames';
import styles from './Card.module.css';

export function Card({ children, className, onClick, hoverable = false }) {
  return (
    <div 
      className={cx(styles.card, { [styles.hoverable]: hoverable || !!onClick }, className)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
