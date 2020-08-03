import React, { Component } from 'react'

// firebase
import firebase from 'baas/firebase'

// 유틸리티
import { translateErrorMessage, generateRandomAvatar } from 'utils'

// Semantic UI 컴포넌트 추출
import {
  Grid,
  Segment,
  Header,
  Message,
  Form,
  Button,
  Icon,
} from 'semantic-ui-react'

// React Router
import { Link } from 'react-router-dom'

// Styled Components
import styled from 'styled-components'
import { saveUser } from 'store/actions'
import { connect } from 'react-redux'

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
 * @class Register
 */
class Register extends Component {
  // 상태
  state = {
    themeColor: 'teal',
    // 폼 입력 상태
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    // 로딩 상태
    loading: false,
    // 오류 상태
    error: null,
    // Firebase 참조
    usersRef: firebase.database().ref('users'),
  }

  // 메서드
  isFormEmpty = ({ username, email, password, passwordConfirm }) => {
    return [username, email, password, passwordConfirm].some(
      (value) => value.trim().length === 0
    )
  }

  isPasswordInvalid = ({ password, passwordConfirm }) => {
    if (password.length < 6) {
      return { message: '패스워드는 6자리 이상 입력해야 합니다.' }
    } else if (password !== passwordConfirm) {
      return { message: '입력한 패스워드와 확인용 패스워드가 다릅니다.' }
    } else {
      return false
    }
  }

  formValidation = () => {
    // 오류 발생 조건 1
    if (this.isFormEmpty(this.state)) {
      this.setState({ error: { message: '입력 필드를 모두 채워주세요.' } })
      return false
    }

    // 오류 발생 조건 2
    const checkPassword = this.isPasswordInvalid(this.state)
    if (checkPassword) {
      this.setState({ error: checkPassword })
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

  saveUser = ({ user }) => {
    const { usersRef } = this.state
    const { uid, displayName, photoURL } = user

    // 데이터베이스 → users 참조를 통해
    return (
      usersRef
        // 사용자 고유 ID 값에
        .child(uid)
        // { name, avatar } 데이터를 저장
        .set({
          name: displayName,
          avatar: photoURL,
        })
    )
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
      const { username, email, password } = this.state

      // firebase 앱
      firebase
        // 인증
        .auth()
        // 이메일, 패스워드로 사용자 생성 요청
        .createUserWithEmailAndPassword(email, password)
        // 응답(성공)
        .then((createdUser) => {
          // console.log(createdUser)

          // 사용자 프로필 업데이트
          createdUser.user
            .updateProfile({
              displayName: username,
              photoURL: generateRandomAvatar(email),
            })
            .then(() => {
              // 스토어 상태에 authUser 반영
              this.props.saveUser(createdUser)
              // 데이터베이스에 사용자 정보 저장
              this.saveUser(createdUser)
                .then(() => {
                  console.log('사용자 정보 저장 됨')
                })
                .catch((error) => console.error(error.message))

              // 로딩, 오류 상태 업데이트
              this.setState({
                loading: false,
                error: null,
              })
            })
            .catch((error) => {
              console.error(error.message)
              // 로딩, 오류 상태 업데이트
              this.setState({
                loading: false,
                error,
              })
            })
        })
        // 응답(실패)
        .catch((error) => {
          console.error(error.message)

          // 로딩, 오류 상태 업데이트
          this.setState({
            loading: false,
            error: { message: translateErrorMessage(error.message) },
          })
        })
    } else {
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
    const {
      themeColor,
      username,
      email,
      password,
      passwordConfirm,
      error,
      loading,
    } = this.state

    return (
      <StyledGrid textAlign="center" verticalAlign="middle">
        <StyledColumn>
          <Header as="h2" icon color={themeColor} textAlign="center">
            <Icon name="react" color={themeColor} />
            <strong>chatApp</strong> 회원가입
          </Header>

          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <label htmlFor="username" className="a11yHidden">
                이름
              </label>
              <Form.Input
                fluid
                type="text"
                id="username"
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="이름: 이사라"
                // 이벤트 연결
                onInput={this.handleInput}
                value={username}
                className={this.displayErrorClass(error, [
                  '이름',
                  'name',
                  '모두',
                ])}
              />

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
                className={this.displayErrorClass(error, [
                  '이메일',
                  'email',
                  '모두',
                ])}
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
                className={this.displayErrorClass(error, [
                  '패스워드',
                  'password',
                  '모두',
                ])}
              />

              <label htmlFor="passwordConfirm" className="a11yHidden">
                패스워드 다시 입력
              </label>
              <Form.Input
                fluid
                type="password"
                id="passwordConfirm"
                name="passwordConfirm"
                icon="repeat"
                iconPosition="left"
                placeholder="비밀번호 다시 입력"
                onInput={this.handleInput}
                value={passwordConfirm}
                className={this.displayErrorClass(error, [
                  '패스워드',
                  'password',
                  '모두',
                ])}
              />

              {/* 로딩, 비활성화 상태 업데이트 */}
              <Button
                loading={loading}
                disabled={loading}
                fluid
                size="large"
                color={themeColor}
              >
                가입
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
            이미 회원이라면? <Link to="/login">로그인</Link> 페이지로
            이동하세요.
          </Message>
        </StyledColumn>
      </StyledGrid>
    )
  }
}
const mapDispatchToProps = {
  saveUser,
}

export default connect(null, mapDispatchToProps)(Register)
