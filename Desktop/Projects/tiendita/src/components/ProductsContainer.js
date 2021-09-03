import React from 'react'
import '../css/ProductsContainer.css'

function ProductsContainer (props) {
    return (
        <React.Fragment>
            <div className='products-container'>
                <h3 className='container-title'>Ofertas</h3>
                <div className='product-carrousel'>
                    {props.children}
                </div>
            </div>
        </React.Fragment>
    )
}

export {ProductsContainer}