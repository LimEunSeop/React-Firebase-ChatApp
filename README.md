# 이미지(미디어) 파일 업로드

이미지를 업로드 하여 채팅 창에 표시되도록 구현해봅니다.

## MessageForm.js

[[이미지(미디어) 업로드]] 버튼을 클릭하면 FileModal 컴포넌트를 UI에 표시하고,
사용자로부터 업로드 할 이미지 파일을 등록 받아 Firebase 클라우드 스토리지에 업로드 합니다.
업로드 후에는 스토리지로부터 다운 가능한 파일 URL을 받아 메시지 데이터베이스 참조를 통해
데이터베이스에 저장합니다.

```js
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
    // 업로드 테스크
    uploadTask: null,
    // 업로드 진행율
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
    }
    else {
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

    // 업로드 된 이미지 또는 메시지를 분기하여 처리
    if (fileURL !== null) {
      message.image = fileURL
    }
    else {
      message.content = this.state.message
    }

    return message
  }

  openModal = () => this.setState({ modal: true })

  closeModal = () => this.setState({ modal: false })

  uploadFile = (file, metadata) => {
    const { currentChannel } = this.props
    const { storageRef, messagesRef, uploadTask } = this.state

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
            // 업로드 진행율(%) 계산
            const percent = Math.round(snapshot.byteTransferred / snapshot.totalBytes * 100)
            // 상태 업데이트
            this.setState({
              percentLoaded: percent,
            })
          },
          // 오류 발생 시
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
          style={css`margin-bottom: 0.7em;`}
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
          <FileModal modal={modal} uploadFile={this.uploadFile} closeModal={this.closeModal} />
        </Button.Group>
      </MessageInputController>
    )
  }
}

export default connect(mapStateToProps)(MessagesForm)
```

## FileModal.js

이미지 파일을 업로드 하는 모달 컴포넌트는 다음과 같이 구성합니다.

```js
import React, { Component } from 'react'
import mime from 'mime-types'
import { Modal, Input, Button, Icon } from 'semantic-ui-react'

/**
 * @class FileModal
 */
class FileModal extends Component {
  // 상태
  state = {
    file: null,
    validFileTypes: [ 'images/jpeg', 'images/png' ],
  }

  // 이벤트 핸들러

  handleInput = ({ target }) => {
    const file = target.files[0]

    if (file) {
      this.setState({ file })
    }
  }

  handleUploadFile = () => {
    const { file } = this.state
    const { uploadFile, closeModal } = this.props

    // 업로드 할 파일이 있고 업로드 가능한 파일 타인 경우
    if (file !== null && !this.isValidFileType(file.name)) {
      // 메타데이터 설정
      const metadata = {
        contentType: mime.lookup(file.name),
      }

      // 파일 업로드
      uploadFile(file, metadata)
      // 모달 닫기
      closeModal()
      // file 상태 비우기
      this.clearFile()
    }
  }

  // 메서드

  isValidFileType = (fileName) => {
    // 참고: https://www.npmjs.com/package/mime-types#mimelookuppath
    this.state.validFileTypes.includes(mime.lookup(fileName))
  }

  clearFile = () => {
    this.setState({ file: null })
  }

  // 렌더
  render() {
    const { modal, closeModal } = this.props

    return (
      <Modal size="small" dimmer="inverted" basic open={modal} onClose={closeModal}>
        <Modal.Header>이미지(미디어) 파일 업로드</Modal.Header>
        <Modal.Content>
          <Input
            fluid
            label="파일 타입(JPEG, PNG)"
            type="file"
            name="file"
            onInput={this.handleInput}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button color="teal" onClick={this.handleUploadFile}>
            <Icon name="checkmark" /> 전송
          </Button>
          <Button color="grey" onClick={closeModal}>
            <Icon name="cancel" /> 취소
          </Button>
        </Modal.Actions>
      </Modal>
    )
  }
}

export default FileModal
```

## MessageItem.js

메시지 아이템 컴포넌트는 새로운 메시지가 가진 속성이 `image`인지, `content`인지 구분하여 
이미지 또는 메시지 텍스트를 화면에 렌더링 하도록 조건 분기 합니다.

```js
import React from 'react'
import { Comment, Image } from 'semantic-ui-react'
import moment from 'moment'
import 'moment/locale/ko'
import { css } from 'utils'
import styled from 'styled-components'

/* -------------------------------------------------------------------------- */

// moment 포멧
moment().format('LT') // 오후 4:56

/* -------------------------------------------------------------------------- */

const messageOwnerStyle = css`
  border-right: 1px solid #81bdca;
  padding-right: 8px;
`

const messageStyle = css`
  border-left: 1px solid #81bdca;
  padding-left: 8px;
`

const CommentAvatar = styled(Comment.Avatar)`
  margin-left: ${({ own }) => (own === 'true' ? '8px !important' : null)};
  margin-right: 8px !important;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
`

/* -------------------------------------------------------------------------- */

// 메시지 주인(소유자) 확인
function isOwnMessage(message, authUser) {
  return message.user.id === authUser.uid
}

function isImage(message) {
  return message.hasOwnProperty('image') && !message.hasOwnProperty('content')
}

function timeToNow(timestamp) {
  // 참고: https://momentjs.com/
  return moment(timestamp).fromNow()
}

/**
 * @function MessageItem
 */
const MessageItem = ({ message, authUser }) => {
  const isOwn = isOwnMessage(message, authUser)

  return (
    <Comment
      style={
        isOwn ? (
          css`
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
          `
        ) : null
      }
    >
      <CommentAvatar src={message.user.avatar} own={isOwn.toString()} />
      <Comment.Content style={isOwn ? messageOwnerStyle : messageStyle}>
        <Comment.Author as="a">{message.user.name}</Comment.Author>
        <Comment.Metadata>{timeToNow(message.timestamp)}</Comment.Metadata>
        {isImage(message) ? (
          <Image src={message.image} style={css`padding: 1em;`} />
        ) : (
          <Comment.Text>{message.content}</Comment.Text>
        )}
      </Comment.Content>
    </Comment>
  )
}

export default MessageItem
```

<!-- ----------------------------------------------------------------------- -->

<style>
  .note { margin-bottom: 1.5rem; padding: 12px; border-radius: 5px; background: #f2f2f2; color: #303952; }
  .note-title { display: block; margin-bottom: 1em; font-weight: bold; color: #111 }
  .note a { text-decoration: none; color: inherit; }
  .note p { margin-bottom: 0.6em; line-height: 1.7 }
  .note p:last-child { margin-bottom: 0.2em; }
  .icon { vertical-align: -4px; margin-right: 5px; width: 20px; height: 20px; }
  .icon path { fill: red; }

  /* GitHub Code Style */
  .hljs-attr { color: #221877; }
  .hljs-string { color: #C2185B; }
</style>

<!-- 

<div class="note">
  <strong class="note-title">📝 NOTE.</strong>
  <p></p>
</div>

<div class="note">
  <strong class="note-title">📝 NOTE.</strong>
  <p>Semantic UI React 프레임워크의 <b><a href="https://react.semantic-ui.com/elements/loader/">Loader 컴포넌트 사용 방법</a></b>을 확인하세요.</p>
</div> 

<br>

## 전체 코드

작성된 전체 코드는 다음과 같습니다.

```js

```

-->