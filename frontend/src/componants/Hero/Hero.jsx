import "./Hero.css"
import BackgroundImage from "../../images/background.png"

const Hero = () => {
    return (
        <div className="Hero">
            <div className="Hero__img">
                <img src={BackgroundImage} alt="background image" />
                <div className="Hero__text">
                    <h2>Streamline Your Grading with <br /> AnswerCheck </h2>
                    <p>Effortlessly upload answer sheets, extract text, and get instant accuracy and authenticity, insights. Focus on teaching, not grading</p>
                    <button>Get Started - Upload Now</button>
                </div>
            </div>
        </div>
    )
}

export default Hero