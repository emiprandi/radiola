import React from 'react';
import styles from './_login.css';

const Login = (props) => {
  return (
    <div className={styles.container}>
      <button onClick={props.onConnect} className={styles.btn}>CONNECT</button>
    </div>
  );
}

export default Login;
