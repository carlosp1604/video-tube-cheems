import { NextPage } from 'next'
import { Login } from '~/modules/Auth/Infrastructure/Components/Login/Login'
import styles from '../../components/pages/SigninPage/SigninPage.module.scss'

const SignInPage: NextPage = () => {
  return (
    <section className={ styles.signinPage__container }>
      <div className={ styles.signinPage__login }>
        <Login
          modal={ null }
        />
      </div>
    </section>
  )
}

export default SignInPage
