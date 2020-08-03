import React, { Component } from 'react'
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react'
import styled from 'styled-components'
import { css } from 'utils'

import firebase from 'baas/firebase'

/* -------------------------------------------------------------------------- */

import { connect } from 'react-redux'

const mapStateToProps = ({ user }) => ({
  authUser: user.authUser,
})

/* -------------------------------------------------------------------------- */

const StyledDropDown = styled(Dropdown)`
  .dropdown.icon {
    color: #fff;
  }
`

const DropdownButton = styled.button`
  width: ${({ fluid }) => (fluid ? '100%' : null)};
  background: transparent;
  border: 0;
  padding: ${({ narrow }) => (narrow ? '0.3em 0.45em' : '0.45em 0.67em')};
  text-align: left;
  font-weight: bold;
  color: ${({ inverted }) => (inverted ? '#333' : '#fff')};
`

/* -------------------------------------------------------------------------- */

/**
 * @class USerPanel
 */
class UserPanel extends Component {
  // 메서드
  dropdownOptions = (authUser) => [
    {
      key: 'user',
      text: (
        <DropdownButton
          fluid
          inverted
          narrow
          disabled
          style={css`
            display: flex;
            align-items: center;
            cursor: not-allowed;
          `}
        >
          <Image
            src={authUser.photoURL}
            circular
            style={css`
              width: 35px;
              height: 35px;
              margin-right: 15px;
              border: 1px solid rgba(0, 0, 0, 0.1);
            `}
          />
          {authUser.email}
        </DropdownButton>
      ),
    },
    {
      key: 'avatar',
      text: (
        <DropdownButton fluid inverted narrow>
          아바타 변경
        </DropdownButton>
      ),
    },
    {
      key: 'logout',
      text: (
        <DropdownButton fluid inverted narrow onClick={this.handleSignOut}>
          로그아웃
        </DropdownButton>
      ),
    },
  ]

  // 이벤트 핸들러
  handleSignOut = () => {
    firebase.auth().signOut().then(() => {
      console.log('성공적으로 로그아웃 되었습니다.')
    })
  }

  render() {
    const { authUser: { displayName, photoURL, email } } = this.props

    return (
      <Grid>
        <Grid.Column>
          <Grid.Row
            style={css`
              padding: 1.2em;
              margin: 0;
            `}
          >
            {/* 앱 헤더 */}
            <Header as="h2" inverted floated="left">
              <Icon name="react" />
              <Header.Content>chatApp</Header.Content>
            </Header>

            {/* 드롭다운 메뉴 */}
            <Header as="h3" inverted style={css`padding: 0.25em;`} className="a11yHidden">
              드롭다운 메뉴
            </Header>
            <StyledDropDown
              trigger={<DropdownButton>{displayName}</DropdownButton>}
              options={this.dropdownOptions({ photoURL, email })}
              style={css`margin: 20px 0 -20px -10px;`}
            />
          </Grid.Row>
        </Grid.Column>
      </Grid>
    )
  }
}

export default connect(mapStateToProps)(UserPanel)
