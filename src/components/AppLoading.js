import React from 'react'
import { Loader, Dimmer } from 'semantic-ui-react'

/**
 * @function AppLoading
 */
const AppLoading = ({ message }) => (
  <Dimmer inverted active>
    <Loader size="huge" content={message} />
  </Dimmer>
)

AppLoading.defaultProps = {
  message: '로딩 중...',
}

export default AppLoading
