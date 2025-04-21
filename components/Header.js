import React from 'react'
import { MenuMenu, Menu, Button } from 'semantic-ui-react'
import Routes from '../routes'

export function Header() {
  return (
       <Menu style={{ marginTop: '10px' }}>
        <Routes.Link route='/'>
          <Button primary>CrowdCoin</Button>
        </Routes.Link>

        <MenuMenu position='right'>
          <Routes.Link route='/'>
            <Button primary>Campaigns</Button>
          </Routes.Link>
          <Routes.Link route='/campaigns/new'>
            <Button primary>+</Button>
          </Routes.Link>
        </MenuMenu>
      </Menu>
  )
}