import React, { Component } from 'react'
import { Segment, Header, Icon, Input } from 'semantic-ui-react'
import { css } from 'utils'

/**
 * @class MessagesHeader
 */
class MessagesHeader extends Component {
  render() {
    return (
      <Segment clearing>
        {/* 채널 타이틀 */}
        <Header as="h2" floated="left" style={css`margin: 0;`}>
          <strong
            style={css`
              display: block;
              margin-bottom: 7px;
            `}
          >
            채널 이름 <Icon name="star outline" color="black" />
          </strong>
          <Header.Subheader>채널 참가자 {3}명</Header.Subheader>
        </Header>

        {/* 채널 검색 */}
        <Header floated="right">
          <Input
            size="mini"
            icon="search"
            name="searchTerm"
            aria-label="검색"
            placeholder="검색어를 입력하세요."
          />
        </Header>
      </Segment>
    )
  }
}

export default MessagesHeader
