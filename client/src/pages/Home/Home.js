import React, {useState} from 'react';
import SignIn from '../../components/SignIn';
import SignUp from '../../components/SignUp';
import styles from './Home.module.css';

const Home = () => {
    const [state, setState] = useState(false);

    const buttonHandler = () => {
        setState(state => !state);
    }

    const textButton = state ? 'SignIn' : 'SignUp';

    return (
        <div className={styles.container}>
            <header><button onClick={buttonHandler}>{textButton}</button></header>
            <main className={styles['form-wrapper']}>
                {state ? <SignUp /> : <SignIn /> }
                {/* {error && <div className={styles['error-container']}>{error.err}</div>} */}
            </main>
        </div>
    );
}

export default Home;
