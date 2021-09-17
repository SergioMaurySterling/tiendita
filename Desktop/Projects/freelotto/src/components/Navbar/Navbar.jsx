import React from 'react'
import srcLogo from '../images/Navbar/freelottoLogo.png'
import { NavbarContainer, LogoBox, Menu, NavSection, Dropdown, DropdownMenu, Button } from './NavbarStyles'

export const Navbar = () => {

  const renderNavbar = (transparent) => (
    <NavbarContainer transparent={transparent}>
      <LogoBox className='header-logo-custom'>
        <img src={srcLogo} alt='' />
      </LogoBox>
      <Menu>
        <li>  Play Now   </li>
        <Dropdown> Results
          <DropdownMenu>
            <li> Candidatos </li>
            <li> Empresas  </li>
          </DropdownMenu>
        </Dropdown>
        <li>  Clip2Giv  </li>
        <li>  FAQ </li>
        <li> Tell a Friend </li>
      </Menu>
      <Button> Sign Up </Button>
    </NavbarContainer>
  )
  return (
    <NavSection>
      {renderNavbar(false)}
    </NavSection>
  )
}
