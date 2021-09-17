import { createGlobalStyle } from 'styled-components'
import  Image from '../images/ladingpagebackground.png'

export const GlobalStyles = createGlobalStyle`
  html{
    box-sizing:border-box;
    font-family: Pangram;
  }

  *, *:after, *:before{
    box-sizing: inherit;
  }

  ul ,li ,h1 ,h2 ,h3 ,p ,button{
    margin: 0;
    padding: 0;
  }

  ul{
    list-style: none;
  }

  button{
    background: transparent;
    border:0;
    outline: 0;
  }

  body{
    background-color: #fefefe;
    height: 100vh;
    max-width: 100%;
    margin: 0 auto;
    overscroll-behavior: none; //evita que nuestra app haga rebotes cuando usamos scroll
    background-image:url(${Image});
  }

  #app{
    box-shadow: 0 0 10px rgba(0,0,0,.05);
    overflow-x: hidden;
    //height: 100vh;  // si se le da esta propiedad, no se puede acceder a window ni document
    padding-bottom: 10px;
  }
`