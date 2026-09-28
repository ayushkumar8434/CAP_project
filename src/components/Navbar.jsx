import './Navbar.css'



function Navbar(){
    return(
        <nav className="navbar">
            <div className="logo">NewPhone</div>

            <div className="nav-links">
            <a herf="/"></a>
            <a herf="/buy">Buy Phones</a>
            <a herf="/sell">Sell Your Phone</a>
            <a herf="/login"
             className="login-btn">Login</a>
            </div>
        </nav>
    )
}

export default Navbar