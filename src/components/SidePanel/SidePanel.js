import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import { css } from 'utils'

/* -------------------------------------------------------------------------- */

import UserPanel from './UserPanel'
import Channels from './Channels'

/* -------------------------------------------------------------------------- */

/**
 * @classs SidePanel
 */
class SidePanel extends Component {
  render() {
    return (
      <Menu
        size="large"
        inverted
        fixed="left"
        vertical
        style={css`
          background: #0097a7;
          font-size: 1.2rem;
        `}
      >
        <UserPanel />
        <Channels />
      </Menu>
    )
  }
}

export default SidePanel
