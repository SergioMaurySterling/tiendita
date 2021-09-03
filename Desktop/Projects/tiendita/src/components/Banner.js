import React from 'react'
import '../css/Banner.css'

/*Images*/
import bannerphoto from '../images/banner.jpg'

export const Banner = () =>{
    return (
        <>
            <div className="banner-container">
                <div className='text-container'>
                    <h1 className='banner-text'>¡Adquiere todos tus productos favoritos al mejor precio!</h1>
                </div>
            </div>
        </>
    )
}