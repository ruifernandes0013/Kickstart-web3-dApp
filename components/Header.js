import React from 'react'
import { MenuMenu, Menu } from 'semantic-ui-react'
import Routes from '../routes'

export function Header() {
  return (
       <Menu style={{ marginTop: '10px' }}>
        <Routes.Link route='/'>
          <a className='item'>CrowdCoin</a>
        </Routes.Link>

        <MenuMenu position='right'>
          <Routes.Link route='/'>
            <a className='item'>Campaigns</a>
          </Routes.Link>
          <Routes.Link route='/campaigns/new'>
            <a className='item'>+</a>
          </Routes.Link>
        </MenuMenu>
      </Menu>
  )
}