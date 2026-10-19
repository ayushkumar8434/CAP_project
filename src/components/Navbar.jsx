import './Navbar.css'
import { Link } from 'react-router-dom'



function Navbar(){
    return(
        <nav className="navbar">
            <Link className="logo" to="/">NewPhone</Link>

            <div className="nav-links">
            <Link to="/">Buy Phones</Link>
            <Link to="/sell">Sell Your Phone</Link>
            <a href="/login"
             className="login-btn">Login</a>
            </div>
        </nav>
    )
}

export default Navbar