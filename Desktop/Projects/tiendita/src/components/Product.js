import React from 'react'
import '../css/Product.css'


export let Product = (props) =>{

    let disscount = props.price-((props.price*props.disscountbadge)/100)

    var BadgeClass = ''
    var disscountClass = ''

    if (!props.disscountbadge==0){
        var BadgeClass = 'badge rounded-pill bg-danger'
        var disscountClass = 'product-price-disscount'
    } else {
        var BadgeClass = 'false-disscount'
        var disscountClass = 'no-disscount'
    }

    return (
        <React.Fragment>
                    <div className='product-container'>
                        <span className={BadgeClass}>{`${props.disscountbadge}%`}</span>
                        <img className='product-image' src={props.photo} alt={props.photo} />
                        <div className='products-prices-container'>
                            <p className='product-price'>{`$${props.price}`}</p>
                            <p className={disscountClass}>{`$${disscount.toFixed(3)}`}</p>
                        </div>
                        <p className='product-name'>{props.name}</p>
                        <button type="button" className="btn btn-success">Agregar</button>
                    </div>
        </React.Fragment> 
    )
}