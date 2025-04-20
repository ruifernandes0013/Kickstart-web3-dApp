import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'

const Loading = () => (
  <Dimmer active inverted>
    <Loader />
  </Dimmer>
)

export default Loading