import React, { Component } from 'react'
import { Menu, Icon, Button, Modal, Form, Input, TextArea } from 'semantic-ui-react'
import styled from 'styled-components'
import firebase from 'baas/firebase'
import { css } from 'utils'

/* -------------------------------------------------------------------------- */

import { connect } from 'react-redux'
import { setCurrentChannel } from 'store/actions'

const mapDispatchToProps = {
  setCurrentChannel,
}

/* -------------------------------------------------------------------------- */

const ChannelButton = styled(Button)`
  margin-left: 10px !important;
  background: none !important;
  color: rgba(255, 255, 255, 0.7) !important;

  :hover,
  :focus {
    background: rgba(255, 255, 255, 0.2) !important;
  }
`

/* -------------------------------------------------------------------------- */

/**
 * @class Channels
 */
class Channels extends Component {
  // 상태
  state = {
    channels: [],
    modal: false,
    channelName: '',
    channelDetails: '',
    // 데이터베이스 `channels` 참조
    channelsRef: firebase.database().ref('channels'),
    // 처음 로딩된 상태
    firstLoad: true,
    // 활성화 채널 ID
    activeChannelID: '',
  }

  // 라이프 사이클 훅

  componentDidMount() {
    // 리스너 추가
    this.addListener()
  }

  addListener = () => {
    // 채널 정보를 가져와 수집 할 목록
    let loadChannels = []

    // Firebase 데이터베이스에서 채널이 추가되면 발생하는 이벤트 핸들러
    this.state.channelsRef.on('child_added', (snapshot) => {
      // 읽어들인 채널을 채널 목록에 푸시
      loadChannels.push(snapshot.val())
      // console.log(loadChannels)

      // 채널 상태 업데이트
      this.setState(
        {
          channels: loadChannels,
        },
        // 상태 변경 후 콜백
        () => {
          // 첫번째 채널 활성화
          this.setFirstChannel()
        }
      )
    })
  }

  // 메서드

  openModal = () => this.setState({ modal: true })

  closeModal = () => this.setState({ modal: false })

  formValidation = ({ channelName, channelDetails }) => {
    return channelName.trim().length > 0 && channelDetails.trim().length
  }

  addChannel = () => {
    const { channelsRef, channelName, channelDetails } = this.state

    // 새롭게 추가할 채널 데이터베이스 참조 키 가져오기
    const key = channelsRef.push().key

    // 현재 인증 사용자 정보 추출
    const { displayName, photoURL } = firebase.auth().currentUser

    // 새로운 채널 정보
    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: displayName,
        avatar: photoURL,
      },
    }

    // 채널 데이터베이스 참조
    channelsRef
      // key 값을 uid로 가지는 자식 참조에
      .child(key)
      // 새로운 채널 업데이트
      .update(newChannel)
      // 응답(성공)
      .then(() => {
        // 채널 입력 정보 초기화
        this.setState({
          channelName: '',
          channelDetails: '',
        })
        // 채널 추가 모달 닫기
        this.closeModal()

        console.log('채널이 추가되었습니다.')
      })
      // 응답(오류)
      .catch((error) => console.error(error.message))
  }

  renderChannels = () => {
    const { channels, activeChannelID } = this.state

    return (
      channels.length > 0 &&
      channels.map((channel) => (
        <Menu.Item
          as="button"
          key={channel.id}
          name={channel.name}
          style={css`
            display: block;
            width: 100%;
            border: 0;
            padding-left: 3.6rem;
            text-align: left;
          `}
          // 현재 채널 아이템 활성화
          active={activeChannelID === channel.id}
          onClick={() => this.changeChannel(channel)}
        >
          <strong style={css`opacity: 1;`}># {channel.name}</strong>
        </Menu.Item>
      ))
    )
  }

  changeChannel = (channel) => {
    this.setActiveChannel(channel)
    this.props.setCurrentChannel(channel)
  }

  setActiveChannel = (channel) => {
    this.setState({ activeChannelID: channel.id })
  }

  setFirstChannel = () => {
    const { firstLoad, channels } = this.state

    // 처음 로딩 시, 채널 아이템이 1개 이상인 경우에만 처리
    if (firstLoad && channels.length > 0) {
      const firstChannel = channels[0]
      // 첫번째 채널을 현재 활성화 된 채널로 설정
      this.props.setCurrentChannel(firstChannel)
      this.setActiveChannel(firstChannel)
    }

    // 상태 변경
    this.setState({ firstLoad: false })
  }

  // 이벤트 핸들러

  handleInput = ({ target }) => {
    this.setState({
      [target.name]: target.value.trim(),
    })
  }

  handleAddChannel = () => {
    if (this.formValidation(this.state)) {
      this.addChannel()
    }
  }

  // 렌더
  render() {
    const { channels, modal } = this.state

    return (
      <React.Fragment>
        <Menu.Menu style={css`padding-bottom: 2em;`}>
          <Menu.Item>
            <strong lang="en" style={css`color: rgba(255, 255, 255, 0.7);`}>
              <Icon name="wechat" size="large" /> CHANNELS
            </strong>{' '}
            (<b>{channels.length}</b>)
            <ChannelButton icon aria-label="채널 추가" onClick={this.openModal}>
              <Icon name="add" style={css`color: inherit;`} />
            </ChannelButton>
          </Menu.Item>

          {/* 채널 목록 */}
          {this.renderChannels()}
        </Menu.Menu>

        {/* 채널 추가 모달 */}
        <Modal size="small" dimmer="inverted" basic open={modal} onClose={this.closeModal}>
          <Modal.Header>채널 추가</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Field>
                <Input fluid label="채널 이름" name="channelName" onInput={this.handleInput} />
              </Form.Field>

              <Form.Field>
                <TextArea
                  name="channelDetails"
                  placeholder="채널 소개를 작성하세요."
                  onInput={this.handleInput}
                  style={css`max-height: 300px;`}
                  rows={4}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="teal" onClick={this.handleAddChannel}>
              <Icon name="add" /> 추가
            </Button>
            <Button color="grey" onClick={this.closeModal}>
              <Icon name="cancel" /> 취소
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    )
  }
}

export default connect(null, mapDispatchToProps)(Channels)
