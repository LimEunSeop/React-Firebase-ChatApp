import React, { useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  withRouter,
} from 'react-router-dom'

// firebase
import firebase from 'baas/firebase'

/* -------------------------------------------------------------------------- */

// 컴포넌트
import App from 'components/App'
import Register from 'components/Auth/Register'
import Login from 'components/Auth/Login'
import AppLoading from 'components/AppLoading'

/* -------------------------------------------------------------------------- */

// connect() 고차 컴포넌트
import { connect } from 'react-redux'

// 액션 크리에이터
import { saveUser, clearUser } from 'store/actions'

/* -------------------------------------------------------------------------- */

const mapStateToProps = ({ user }) => ({
  authUser: user.authUser,
  isLoading: user.isLoading,
})

const mapDispatchToProps = {
  saveUser,
  clearUser,
}

/**
 * @function AppRouter
 */
const AppRouter = () => (
  <Router>
    {/* 하단에 위치한 WithRouterSwitch 컴포넌트 */}
    <WithRouterSwitch />
  </Router>
)

/**
 * @function WithRouterSwitch
 * @summary connect() → withRouter() → Switch 컴포넌트 래핑
 */
const WithRouterSwitch = connect(
  mapStateToProps,
  mapDispatchToProps
)(
  withRouter(({ history, saveUser, clearUser, authUser, isLoading }) => {
    // 사이드 이펙트
    useEffect(() => {
      firebase.auth().onAuthStateChanged((currentUser) => {
        // 현재 인증된 사용자 출력
        // console.log(currentUser)

        // 인증 사용자가 있을 경우
        if (currentUser) {
          // 스토어 인증 사용자 정보 저장
          // 혹시나 비정상적으로 변경될 것, 회원가입후 두번 dispatch 되지않도록 조건 설정
          if (currentUser !== authUser) {
            saveUser(currentUser)
          }
          // 홈 페이지로 이동
          history.push('/')
        } else {
          // 인증 사용자가 없을 경우
          history.push('/login')
          // 스토어 user 상태 클리어
          clearUser()
        }
      })
    }, [history, authUser, saveUser, clearUser])

    // 로딩 중
    if (isLoading) {
      return <AppLoading message="chatApp을 준비 중입니다..." />
    }

    // 로딩 완료
    return (
      <Switch>
        <Route path="/" component={App} exact />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Redirect to="/" />
      </Switch>
    )
  })
)

export default AppRouter
