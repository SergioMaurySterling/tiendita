import '../css/App.css';
import {Navbar} from './Navbar'
import {Banner} from './Banner'
import {ProductsContainer} from './ProductsContainer'
import { Product } from './Product';

/*Fotos*/
import jugouva from '../images/jugomora.jpeg'
import mermelada from '../images/mermelada.jpeg'
import lomo from '../images/lomo.jpeg'
import costilla from '../images/costilla.jpeg'
import iphone from '../images/iphone.jpeg'
import papa from '../images/papa.jpeg'
import pina from '../images/pina.jpeg'
import aguacate from '../images/aguacate.jpeg'
import fresa from '../images/fresa.jpeg'
import platano from '../images/platano.jpeg'

function App() {

  const ofertas = [
    {name:'Jugo Uva x 500 ml' , price:12.971 , photo:jugouva , disscountbadge:32},
    {name:'Mermelada Dietmer' , price:6.352 , photo:mermelada , disscountbadge:32},
    {name:'Lomo de cerdo' , price:27.543 , photo:lomo , disscountbadge:18},
    {name:'Costilla de res' , price:15.596 , photo:costilla , disscountbadge:13},
    {name:'Iphone 12 Pro Max' , price:5.679 , photo:iphone , disscountbadge:8},
    {name:'Papa frescampo' , price:8.491 , photo:papa , disscountbadge:0},
    {name:'Piña 1 und' , price:4.496 , photo:pina , disscountbadge:0},
    {name:'Aguacate hass' , price:3.545 , photo:aguacate , disscountbadge:0},
    {name:'Fresa 500 gr', price:7.959 , photo:fresa , disscountbadge:0},
    {name:'Platano maduro' , price:643 , photo:platano , disscountbadge:0}
  ]

  const frutas = [
    {name:'Papa frescampo' , price:8.491 , photo:papa , disscountbadge:0},
    {name:'Piña 1 und' , price:4.496 , photo:pina , disscountbadge:0},
    {name:'Aguacate hass' , price:3.545 , photo:aguacate , disscountbadge:0},
    {name:'Fresa 500 gr', price:7.959 , photo:fresa , disscountbadge:0},
    {name:'Platano maduro' , price:643 , photo:platano , disscountbadge:0},
    {name:'Jugo Uva x 500 ml' , price:12.971 , photo:jugouva , disscountbadge:32},
    {name:'Mermelada Dietmer' , price:6.352 , photo:mermelada , disscountbadge:32},
    {name:'Lomo de cerdo' , price:27.543 , photo:lomo , disscountbadge:18},
    {name:'Costilla de res' , price:15.596 , photo:costilla , disscountbadge:13},
    {name:'Iphone 12 Pro Max' , price:5.679 , photo:iphone , disscountbadge:8},
  ]

  const titles = ['Ofertas', 'Frutas']

  return (
    <div>
      <Navbar/>
      <Banner/>
      <ProductsContainer>
        {ofertas.map((o) =>{
          return(
            <Product
              key={o.index} 
              disscountbadge={o.disscountbadge}
              photo={o.photo}
              price={o.price}
              name={o.name}
            />
          )
        })}
      </ProductsContainer>
      <ProductsContainer>
        {frutas.map((f) =>{
          return(
            <Product
              key={f.index} 
              disscountbadge={f.disscountbadge}
              photo={f.photo}
              price={f.price}
              name={f.name}
            />
          )
        })}
      </ProductsContainer>
    </div>
  );
}

export default App;

/* 
Navbar: Logo, Icon + SearchCountryBar, Cart
Banner: Background Image, Text
ProductsContainer: Title, ProductsCarrousel
ProductsCarrousel: Product
Product: disscountbadge, photo, price, name, AddButton
*/
