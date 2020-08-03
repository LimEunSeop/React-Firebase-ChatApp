import React, { Component } from 'react'
import { Segment, Header, Accordion, Icon } from 'semantic-ui-react'
import { css } from 'utils'

/* -------------------------------------------------------------------------- */

const accordionTitleStyle = css`
  display: block;
  width: 100%;
  text-align: left;
  background: 0;
  border: 0;
`

const accordionContentStyle = css`padding-left: 2.75rem;`

/* -------------------------------------------------------------------------- */

/**
 * @class MetaPanel
 */
class MetaPanel extends Component {
  // 상태
  state = {
    activeIndex: 0,
  }

  // 메서드
  setActiveIndex = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({
      activeIndex: newIndex,
    })
  }

  // 렌더
  render() {
    const { activeIndex } = this.state

    return (
      <div>
        <Segment>
          <Header as="h3" attached="top">
            채널 안내
          </Header>
          <Accordion styled attached="true">
            {/* 채널 소개 탭 */}
            <Accordion.Title
              as="button"
              style={accordionTitleStyle}
              active={activeIndex === 0}
              index={0}
              onClick={this.setActiveIndex}
            >
              <Icon name="dropdown" />
              <Icon name="info" />
              채널 소개
            </Accordion.Title>
            <Accordion.Content style={accordionContentStyle} active={activeIndex === 0}>
              {'채널 설명'}
            </Accordion.Content>

            {/* 인기 포스트 탭 */}
            <Accordion.Title
              as="button"
              style={accordionTitleStyle}
              active={activeIndex === 1}
              index={1}
              onClick={this.setActiveIndex}
            >
              <Icon name="dropdown" />
              <Icon name="user circle" />
              인기 포스트
            </Accordion.Title>
            <Accordion.Content style={accordionContentStyle} active={activeIndex === 1}>
              {'인기 포스트'}
            </Accordion.Content>

            {/* 채널 관리자 탭 */}
            <Accordion.Title
              as="button"
              style={accordionTitleStyle}
              active={activeIndex === 2}
              index={2}
              onClick={this.setActiveIndex}
            >
              <Icon name="dropdown" />
              <Icon name="pencil alternate" />
              채널 관리자
            </Accordion.Title>
            <Accordion.Content style={accordionContentStyle} active={activeIndex === 2}>
              {'채널 관리자 정보'}
            </Accordion.Content>
          </Accordion>
        </Segment>
      </div>
    )
  }
}

export default MetaPanel
