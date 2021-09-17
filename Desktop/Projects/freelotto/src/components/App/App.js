/*Components*/
import { Banner } from '../Banner/Banner.jsx'
//import { BrowserRouter as Router, Route } from 'react-router'
import { Navbar } from '../Navbar/Navbar.jsx'
/*Styles*/
import {GlobalStyles} from '../App/GlobalStyles'

function App() {
  return (
    <>
      <GlobalStyles />
      <Navbar />
      <Banner></Banner>
    </>
  );
}

export default App;
