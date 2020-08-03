import React, { Component } from 'react'
import { Segment, Input, Button } from 'semantic-ui-react'
import styled from 'styled-components'
import { css } from 'utils'

import uuid from 'uuid/dist/v4'
import firebase from 'baas/firebase'

import FileModal from './FileModal'

/* -------------------------------------------------------------------------- */

import { connect } from 'react-redux'
const mapStateToProps = ({ channel }) => ({
  currentChannel: channel.currentChannel,
})

/* -------------------------------------------------------------------------- */

const MessageInputController = styled(Segment)`
  position: fixed !important;
  z-index: 200;
  left: 0;
  right: 1em;
  margin-left: 320px !important;
  bottom: 1em;
`

/* -------------------------------------------------------------------------- */

/**
 * @class MessagesForm
 */
class MessagesForm extends Component {
  // 상태
  state = {
    message: '',
    // 인증된 사용자
    currentUser: firebase.auth().currentUser,
    // firebase 데이터베이스 메시지 참조
    messagesRef: firebase.database().ref('messages'),
    // firebase 스토리지 참조
    storageRef: firebase.storage().ref(),
    // 로딩 상태
    loading: false,
    // 오류 상태
    error: null,
    // 모달
    modal: false,
    // 업로드 상태
    uploadState: '',
    // 입로드 테스크
    uploadTask: null,
    // 업로드 진행용
    percentLoaded: 0,
  }

  // 메서드

  sendMessage = () => {
    const { currentChannel } = this.props
    const { messagesRef, message } = this.state

    // 메시지를 보낼 준비가 되었으면
    if (message) {
      // 로딩 상태 업데이트
      this.setState({ loading: true })

      // 활성 채널 ID를 메시지 참조의 자식 경로로 추가
      messagesRef
        .child(currentChannel.id)
        // push() 메서드는 새 데이터 경로에 대한 참조 반환
        // https://firebase.google.com/docs/database/admin/save-data#getting-the-unique-key-generated-by-push
        .push()
        // https://firebase.google.com/docs/database/admin/save-data#section-set
        .set(this.createMessage())
        // 응답(성공)
        .then(() => {
          // 상태 초기화
          this.setState({
            loading: false,
            message: '',
            errors: null,
          })
        })
        // 응답(실패)
        .catch((error) => {
          console.error(error.message)
          this.setState({
            loading: false,
            error,
          })
        })
    } else {
      // 메시지를 보낼 준비가 안된 경우
      this.setState({
        error: '전송 할 메시지를 입력해주세요.',
      })
    }
  }

  createMessage = (fileURL = null) => {
    // 현재 인증 사용자
    const { currentUser } = this.state

    // 새로운 메시지
    const message = {
      // content: this.state.message,
      // 데이터베이스 서버 TIMESTAMP 값
      // https://firebase.google.com/docs/reference/js/firebase.database.ServerValue
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      // 메시지 입력 사용자
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL,
      },
    }

    //업로드 된 이미지 또는 메시지를 분기하여 처리
    if (fileURL !== null) {
      message.image = fileURL
    } else {
      message.content = this.state.message
    }

    return message
  }

  openModal = () => this.setState({ modal: true })
  closeModal = () => this.setState({ modal: false })

  uploadFile = (file, metadata) => {
    const { currentChannel } = this.props
    const { storageRef, messagesRef } = this.state

    // 채널 ID
    const pathToUpload = currentChannel.id

    // 파일 경로 설정
    const filePath = `chat/public/${uuid()}.jpg`

    this.setState(
      {
        uploadState: '업로딩 중...',
        uploadTask: storageRef.child(filePath).put(file, metadata),
      },
      // 상태 업데이트 후
      () => {
        // 업로드 테스크 이벤트 청취
        this.state.uploadTask.on(
          'state_changed',
          (snapshot) => {
            // 업로드 진행률(%) 계산
            const percent = Math.round(
              (snapshot.byteTransferred / snapshot.totalBytes) * 100
            )
            // 상태 업데이트
            this.setState({
              percentLoaded: percent,
            })
          },
          // 오류 발생 시j
          (error) => {
            console.error(error.message)
            this.setState({
              error,
              uploadState: '오류 발생',
              uploadTask: null,
            })
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then((downloadURL) => {
                this.sendFileMessage(downloadURL, messagesRef, pathToUpload)
              })
              .catch((error) => {
                console.error(error.message)
                this.setState({
                  error,
                  uploadState: '오류 발생',
                  uploadTask: null,
                })
              })
          }
        )
      }
    )
  }

  sendFileMessage = (fileURL, ref, path) => {
    ref
      .child(path)
      .push()
      .set(this.createMessage(fileURL))
      .then(() => {
        this.setState({
          uploadState: '업로드 완료!',
        })
      })
      .catch((error) => {
        console.error(error.message)
        this.setState({
          error,
          uploadState: '오류 발생',
          uploadTask: null,
        })
      })
  }

  // 이벤트 핸들러
  handleInput = ({ target }) => {
    this.setState({
      [target.name]: target.value,
    })
  }

  // 렌더
  render() {
    // 상태 추출
    const { message, loading, modal } = this.state

    // 렌더링
    return (
      <MessageInputController>
        <Input
          fluid
          name="message"
          style={css`
            margin-bottom: 0.7em;
          `}
          label={<Button icon="add" aria-label="메시지 추가" />}
          labelPosition="left"
          placeholder="메시지를 작성하세요."
          onInput={this.handleInput}
          value={message}
        />
        <Button.Group icon widths={2}>
          <Button
            loading={loading}
            disabled={loading || message.trim().length === 0}
            icon="edit"
            color="black"
            content="댓글 (메시지) 추가"
            labelPosition="left"
            onClick={this.sendMessage}
          />
          <Button
            icon="cloud upload"
            color="teal"
            content="이미지 (미디어) 업로드"
            labelPosition="right"
            onClick={this.openModal}
          />
          <FileModal
            modal={modal}
            uploadFile={this.uploadFile}
            closeModal={this.closeModal}
          />
        </Button.Group>
      </MessageInputController>
    )
  }
}

export default connect(mapStateToProps)(MessagesForm)
