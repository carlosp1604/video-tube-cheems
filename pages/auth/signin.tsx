import { NextPage } from 'next'
import { Login } from '../../Components/Login/Login'
import styles from '../../Components/pages/SigninPage/SigninPage.module.scss'

const SignInPage: NextPage = () => {
  return (
    <section className={styles.signinPage__container}>
      <div className={styles.signinPage__login}>
        <Login
          modal={null}
        />
      </div>
    </section>
  )
}

export default SignInPage
