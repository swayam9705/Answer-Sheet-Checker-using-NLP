// icons
import { FiUploadCloud } from "react-icons/fi"
import { FaRegLightbulb } from "react-icons/fa"
import { IoMdCheckboxOutline } from "react-icons/io"

import "./Working.css"

const Process = ({ number, icon, heading, desc }) => {
    return (
        <div className="Process">
            <div className="Process__number">{ number }</div>
            <div className="Process__icon">{ icon }</div>
            <div className="Process__heading">{ heading }</div>
            <div className="Process__desc">{ desc }</div>
        </div>
    )
}

const Working = () => {

    return (
        <div className="Working">
            <div className="Working__title">How AnswerCheck Works</div>
            <div className="Working__desc">Our Streamlined process takes the hassle out of grading, providing clear, actionable insights</div>
            <div className="Working__processes">
                <Process
                    number={1}
                    icon={<FiUploadCloud />}
                    heading="Upload"
                    desc="Simple Upload your model answers and student sheets. Our system intelligently processes them."
                />
                <Process
                    number={2}
                    icon={<FaRegLightbulb />}
                    heading="Extract"
                    desc="Advanced AI extracts handwritten text with high accuracy, ready for your review."
                />
                <Process
                    number={3}
                    icon={<IoMdCheckboxOutline />}
                    heading="Analyze"
                    desc="Receive detailed metrics on accuracy, similarity, and authenticity, all in one dashboard."
                />
            </div> 
        </div>
    )
}

export default Working