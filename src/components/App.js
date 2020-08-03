import './App.scss'
import React from 'react'
import { Grid } from 'semantic-ui-react'
import { css } from 'utils'

/* -------------------------------------------------------------------------- */
// 컴포넌트

import ColorPanel from './ColorPanel/ColorPanel'
import SidePanel from './SidePanel/SidePanel'
import Messages from './Messages/Messages'
import MetaPanel from './MetaPanel/MetaPanel'

/* -------------------------------------------------------------------------- */

/**
 * @function App
 */
const App = (props) => (
  <Grid columns="equal" style={css`background-color: #efefef;`}>
    <ColorPanel />
    <SidePanel />

    <Grid.Column
      style={css`
        display: flex;
        flex-flow: column;
        min-width: 600px;
        margin-left: 320px;
      `}
    >
      <Messages />
    </Grid.Column>

    <Grid.Column
      width={4}
      style={css`
        margin-top: 20px;
        margin-right: 30px;
      `}
    >
      <MetaPanel />
    </Grid.Column>
  </Grid>
)

export default App
