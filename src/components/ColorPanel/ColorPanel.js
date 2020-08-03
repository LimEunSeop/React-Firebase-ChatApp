import React, { Component } from 'react'
import { Sidebar, Menu, Divider, Button } from 'semantic-ui-react'

/**
 * @class ColorPanel
 */
class ColorPanel extends Component {
  render() {
    return (
      <Sidebar as={Menu} icon="labeled" inverted vertical visible width="very thin" color="teal">
        <Divider />
        <Button icon="add" size="small" arial-label="컬러 테마 추가" color="black" />
      </Sidebar>
    )
  }
}

export default ColorPanel
