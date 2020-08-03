import React, { Component } from 'react'

// firebase
import firebase from 'baas/firebase'

// 유틸리티
import { translateErrorMessage } from 'utils'

// Semantic UI 컴포넌트 추출
import { Grid, Segment, Header, Message, Form, Button, Icon } from 'semantic-ui-react'

// React Router
import { Link } from 'react-router-dom'

// Styled Components
import styled from 'styled-components'

/* -------------------------------------------------------------------------- */

// 스타일 컴포넌트
const StyledGrid = styled(Grid)`
  min-height: 100vh;
  background: #eee;
`

const StyledColumn = styled(Grid.Column)`
  max-width: 480px;
`

/**
  * @class Login
  */
class Login extends Component {
  // 상태
  state = {
    themeColor: 'violet',
    // 폼 입력 상태
    email: '',
    password: '',
    // 로딩 상태
    loading: false,
    // 오류 상태
    error: null,
    // Firebase 참조
    usersRef: firebase.database().ref('users'),
  }

  // 메서드

  isFormEmpty = ({ email, password }) => {
    return [ email, password ].some((value) => value.trim().length === 0)
  }

  formValidation = () => {
    // 오류 발생 조건
    if (this.isFormEmpty(this.state)) {
      this.setState({ error: { message: '입력 필드를 모두 채워주세요.' } })
      return false
    }

    // 오류 없음
    return true
  }

  displayErrorClass = (error, inputs) => {
    if (error) {
      for (const input of inputs) {
        if (error.message.includes(input)) {
          return 'error'
        }
      }
    }
    return null
  }

  // 이벤트 핸들러
  handleSubmit = (e) => {
    // 로딩, 오류 상태 업데이트
    this.setState({
      loading: true,
      error: null,
    })

    // 회원가입 폼 유효성검사
    if (this.formValidation()) {
      // 브라우저 기본 동작 무시
      e.preventDefault()

      // 이름, 이메일, 패스워드 추출
      const { email, password } = this.state

      // Firebase 인증 → 이메일, 패스워드 로그인 요청
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((loginUser) => {
          // 로그인 사용자 정보 출력
          console.log(loginUser)

          // 로딩 상태 업데이트
          this.setState({
            loading: false,
          })
        })
        .catch((error) => {
          console.error(error.message)

          // 로딩, 오류 상태 업데이트
          this.setState({
            loading: false,
            error: { message: translateErrorMessage(error.message) },
          })
        })
    }
    else {
      // 로딩 상태 업데이트
      this.setState({
        loading: false,
      })
    }
  }

  handleInput = ({ target }) => {
    this.setState({
      [target.name]: target.value.trim(),
    })
  }

  // 렌더
  render() {
    // 상태 추출
    const { themeColor, email, password, error, loading } = this.state

    return (
      <StyledGrid textAlign="center" verticalAlign="middle">
        <StyledColumn>
          <Header as="h2" icon color={themeColor} textAlign="center">
            <Icon name="react" color={themeColor} />
            <strong>chatApp</strong> 로그인
          </Header>

          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <label htmlFor="email" className="a11yHidden">
                이메일
              </label>
              <Form.Input
                fluid
                type="email"
                id="email"
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="이메일: user@dev.io"
                onInput={this.handleInput}
                value={email}
                className={this.displayErrorClass(error, [ '이메일', 'email', '모두' ])}
              />

              <label htmlFor="password" className="a11yHidden">
                패스워드
              </label>
              <Form.Input
                fluid
                type="password"
                id="password"
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="비밀번호 입력"
                onInput={this.handleInput}
                value={password}
                className={this.displayErrorClass(error, [ '패스워드', 'password', '모두' ])}
              />

              {/* 로딩, 비활성화 상태 업데이트 */}
              <Button loading={loading} disabled={loading} fluid size="large" color={themeColor}>
                로그인
              </Button>
            </Segment>
          </Form>

          {error && (
            <Message error>
              <Header as="h3" lang="en">
                ERROR
              </Header>
              {error.message}
            </Message>
          )}

          <Message info>
            아직 회원이 아니라면? <Link to="/register">회원가입</Link> 페이지로 이동하세요.
          </Message>
        </StyledColumn>
      </StyledGrid>
    )
  }
}

export default Login
