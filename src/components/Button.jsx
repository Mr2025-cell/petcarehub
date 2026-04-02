import React from 'react';
import cx from 'classnames';
import styles from './Button.module.css';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className,
  ...props 
}) {
  return (
    <button 
      className={cx(
        styles.button,
        styles[variant],
        styles[size],
        { [styles.fullWidth]: fullWidth },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
