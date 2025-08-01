import { Link } from "react-router"

import "./Navbar.css"
import Logo from "../../images/logo.svg"

const Navbar = () => {
    return (
        <div className="Navbar">
            <div className="Navbar__logo">
                <img src={Logo} alt="Logo image" />
                <span>AnswerCheck</span>
            </div>
            <div className="Navbar__links">
                <Link className="active" to={"#"}>Upload</Link>
                <Link to={"#"}>Extract Text</Link>
                <Link to={"#"}>Results</Link>
            </div>
        </div>
    )
}

export default Navbar