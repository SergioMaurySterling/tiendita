import React from 'react'
import '../css/Navbar.css'

/*icons*/
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined'
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';

export const Navbar = () =>{
    return (
        <React.Fragment>
            <nav className="navbar navbar-light bg-light">
                <div className="container-fluid">
                    <p className="brand">Tiendita</p>
                    <form className="d-flex">
                        {/* <LocationOnOutlinedIcon className='location-icon'/> */}
                        <input className="form-control me-2" type="search" placeholder="Encuentra tu ciudad" aria-label="Search"/>
                        <button type="button" className="btn btn-primary position-relative">
                            <ShoppingCartOutlinedIcon/>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                5
                                <span className="visually-hidden">cart</span>
                            </span>
                        </button>
                    </form>
                </div>
            </nav>
        </React.Fragment>
    )
}