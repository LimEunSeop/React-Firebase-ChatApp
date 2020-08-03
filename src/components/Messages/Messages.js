import React, { Component } from 'react'
import { Segment, Comment } from 'semantic-ui-react'
import styled from 'styled-components'
import { css } from 'utils'
import firebase from 'baas/firebase'

// 컴포넌트
import MessagesHeader from './MessagesHeader'
import MessagesForm from './MessagesForm'
import MessageItem from './MessageItem'
import { connect } from 'react-redux'

/* -------------------------------------------------------------------------- */

const MessageGroup = styled(Comment.Group)`
  min-height: calc(100vh - 320px);
  max-width: 100% !important;
  overflow-y: scroll;
`

/* -------------------------------------------------------------------------- */

class Messages extends Component {
  // 상태
  state = {
    // 로딩 된 메시지 목록
    messages: [],
    // 메시지 로딩 상태
    messageLoading: false,
  }

  // 라이프 사이클 훅

  // componentDidMount()를 사용하려면?
  // Message 컴포넌트의 상위 컴포넌트 영역에서
  // props로 활성 채널 ID를 전달해야 함

  // 그래서 이에 대한 대안책으로 componentDidUpdate()를
  // 사용하되 초기 로딩 상태를 설정. 초기 로딩 상태일 때 1회만 리스너 연결
  componentDidUpdate(prevProps, prevState) {
    // 전달 속성 추출
    const { authUser, currentChannel } = this.props

    if (prevProps.currentChannel !== currentChannel) {
      firebase.database().ref('messages').off()
      this.setState(
        {
          messages: [],
          messageLoading: true,
        },
        () => {
          // 인증 사용자와 현재 활성화 된 채널,
          // 그리고 체널이 초기 1회 로딩 상태인 경우 실행
          if (authUser && currentChannel) {
            // 리스너 연결
            this.addListener(currentChannel)
          }
        }
      )
    }
  }

  // 리스너

  addListener = (channel) => {
    // 읽어들인 메시지 목록
    let loadedMessages = []

    // firebase 데이터베이스 messages 참조를 통해 이벤트 리스너 연결
    firebase
      .database()
      .ref('messages')
      .child(channel.id)
      .on('child_added', (snapshot) => {
        // 스냅샷 값을 메시지 목록에 푸시
        loadedMessages.push(snapshot.val())
        // console.log(loadedMessages)

        // 메시지 목록 상태 업데이트
        this.setState({
          messages: loadedMessages,
          messageLoading: false,
        })
      })
  }

  // 메서드

  renderMessages = (messages) => {
    const { authUser } = this.props

    return (
      messages.length > 0 &&
      messages.map((message) => (
        <MessageItem
          key={message.timestamp}
          message={message}
          authUser={authUser}
        />
      ))
    )
  }

  // 렌더
  render() {
    const { messages } = this.state
    console.log(this.state)

    return (
      <div
        style={css`
          display: flex;
          flex-flow: column;
          flex: 1 1 98vh;
          padding: 20px 10px;
        `}
      >
        {/* 메시지 그룹 헤더 */}
        <MessagesHeader />

        <Segment>
          {/* 메시지 그룹 (채팅 창) */}
          <MessageGroup>
            {/* 메시지 목록 */}
            {this.renderMessages(messages)}
          </MessageGroup>
        </Segment>

        {/* 메시지 그룹 폼 */}
        <MessagesForm />
      </div>
    )
  }
}

const mapStateToProps = ({ user, channel }) => ({
  authUser: user.authUser,
  currentChannel: channel.currentChannel,
})

export default connect(mapStateToProps)(Messages)
