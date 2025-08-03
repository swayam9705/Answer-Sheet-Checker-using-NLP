import { useEffect, useRef, useContext } from "react"
import { Link } from "react-router"
import { FileContext } from "../../StateManager/FileContext";

import "./Upload.css"
import Dropbox from "./Dropbox";

const Upload = () => {
    return (
        <div className="Upload">
            <h2 className="Upload__title">Upload your answer sheets</h2>
            <div className="Upload__container">
                <Dropbox type="model" />
                <Dropbox type="student" />
            </div>
            <div className="Upload__btn">
                <Link className="link__btn" to="#">Process & Review Extracted Text</Link>
            </div>
        </div>
    )
}

export default Upload