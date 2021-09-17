import styled, { css } from 'styled-components'

export const NavSection = styled.section`
    display: grid;
    width: 100%;
`


export const NavbarContainer = styled.nav`
    display: flex;
    position: fixed;
    padding-top:50px;
    padding-bottom: 50px;
    width: 100%;
    background-color: rgba(0, 0, 0, 0);
    justify-content: space-between;
    z-index: 10;
    padding-left: 100px;
    transition: all 0.5s;
    ${props => props.transparent && css`
        background-color: white;
    `
    }
`

export const LogoBox = styled.div`
    display: flex;
    align-items: center;
    img{
        width: 268px;
        height: 60px;
    }
`

export const Menu = styled.ul`
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin: 0px;
    padding: 0px;
    color:white;
    li{
        padding: 16px;
        margin:0 30px;
        list-style: none;
        font-size:18px;
        a{
            text-decoration: none;
            color: white;
            transition: all 0.5s;
            &:hover{
                color: $colorGreen;
            }
        }
    }
`
export const DropdownMenu = styled.ul`
    display: none;
`

export const Dropdown = styled.li`
    color: white;
    cursor: pointer;
    transition: all 0.5s;
    &:hover{
        color: green;
    }

`
export const Button = styled.button`
    color: white;
    background-color: #FCC233;
    margin:10px 0px;
    padding: 5px 10px;
    border-radius: 10px;
    margin-right: 50px;
    cursor: pointer;
    width: 127px;
    height: 55.14px;
    font-size: 18px;
`
