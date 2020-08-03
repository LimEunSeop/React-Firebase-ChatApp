import React from 'react'
import { Comment, Image } from 'semantic-ui-react'
import moment from 'moment'
import 'moment/locale/ko'
import { css } from 'utils'
import styled from 'styled-components'

/* ------------------------------------------------------ */

// moment 포멧: https://monentjs.com/
moment().format('LT') // 오후 4:56

/* ------------------------------------------------------ */

const messageOwnerStyle = css`
  border-left: 1px solid #81bdca;
  padding-left: 8px;
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

/* ------------------------------------------------------ */

// 메시지 주인(소유자) 확인
function isOwnMessage(message, authUser) {
  return message.user.id === authUser.uid
}

function isImage(message) {
  return message.hasOwnProperty('image') && !message.hasOwnProperty('content')
}

function timeToNow(timestamp) {
  return moment(timestamp).fromNow()
}

const MessageItem = ({ message, authUser }) => {
  const isOwn = isOwnMessage(message, authUser)

  return (
    <Comment
      style={
        isOwn
          ? css`
              display: flex;
              flex-direction: row-reverse;
              align-items: center;
            `
          : null
      }
    >
      <CommentAvatar
        src={message.user.avatar}
        style={css`
          border: 2px solid rgba(0, 0, 0, 0, 1);
          border-radius: 4px;
        `}
        own={isOwn.toString()}
      />
      <Comment.Content style={isOwn ? messageOwnerStyle : messageStyle}>
        <Comment.Author as="a">{message.user.name}</Comment.Author>
        <Comment.Metadata>{timeToNow(message.timestamp)}</Comment.Metadata>
        {isImage(message) ? (
          <Image
            src={message.image}
            style={css`
              padding: 1em;
            `}
          />
        ) : (
          <Comment.Text>{message.content}</Comment.Text>
        )}
      </Comment.Content>
    </Comment>
  )
}

export default MessageItem
