import { Link } from "react-router"

import "./Hero.css"
import BackgroundImage from "../../images/background.png"

const Hero = () => {
    return (
        <div className="Hero">
            <div className="Hero__img">
                <img src={BackgroundImage} alt="background image" />
                <div className="Hero__text">
                    <h2>Streamline Your Grading with <br /> AnswerCheck </h2>
                    <p>Effortlessly upload answer sheets, extract text, and get instant accuracy and authenticity, insights. <span className="special">Focus on teaching, not grading</span></p>
                    <Link className="link__btn" to={"#"}>Get Started - Upload Now</Link>
                </div>
            </div>
        </div>
    )
}

export default Hero