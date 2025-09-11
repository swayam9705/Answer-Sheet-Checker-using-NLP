import { useState, useEffect } from "react"
import "./Evaluation.css"
import "./Metric.css"
import EvaluationSkeleton from "./EvaluationSkeleton"
import useTextExtractionContext from "../../StateManager/TextExtraction"

const Metric = ({ parameter, percent, percentSign = true }) => {

    const displayPercent = percent > 100 ? 100 : percent
    return (
        <div className="Metric">
            <div className="Metric__top">
                <span className="Metric__parameter">{ parameter }</span>
                <span className="Metric__percent">
                    { `${percent}` }{ percentSign && "%"}
                </span>
            </div>
            <div className="Metric__meter">
                <div
                    className="Metric__bar"
                    style={{
                        width: `${displayPercent}%`,
                        backgroundColor: percent > 66 ? "#76ff76" : (percent > 33 ? "rgb(255 227 143)" : "rgb(255 84 100)")
                    }}
                ></div>
            </div>
        </div>
    )
}

const Evaluation = () => {

    const [ evaluation, setEvaluation ] = useState({
        keyword: 0,
        semantics: 0,
        tone: "",
        toneScore: 0
    })
    const { extractedText } = useTextExtractionContext()

    const wordCount = {
        model: extractedText.model.trim().split(/\s+/).length,
        student: extractedText.student.trim().split(/\s+/).length
    }

    const feedback = percent => {
        if (percent >= 0 && percent <= 30) {
            return "You have a lot more areas to cover."
        }
        else if (percent < 50) {
            return "Building the Basics"
        }
        else if (percent < 70) {
            return "On the Right Track"
        }
        else if (percent < 85) {
            return "Strong Effort, High Potential"
        }
        else {
            return "Mastery and Excellence"
        }
    }

    const sendAnswerRequest = async () => {
        const data = {
            model: extractedText.model,
            student: extractedText.student
        }
        console.log(data)
        try {
            const sendAnswers = await fetch("http://127.0.0.1:8000/evaluation", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(extractedText)
            })

            const response = await sendAnswers.json()
            console.log(response)
            setEvaluation({
                keyword: response.keyword,
                semantics: response.semantics,
                tone: response.tone,
                toneScore: response.toneScore
            })
        }
        catch (err) {
            console.log("You messed up in evaluation", err)
        }
    }

    const testScore = 0.1 * evaluation.keyword + 0.7 * evaluation.semantics + 0.2 * evaluation.toneScore

    useEffect(() => {
        sendAnswerRequest()
    }, [])

    return (
        evaluation.semantics === 0 ?
        <EvaluationSkeleton /> :
        <div className="Evaluation">
            <div className="Evaluation__title">
                Student Test Summary
            </div>
            <div className="Metrics">
                <Metric
                    parameter="Keywords"
                    percent={Math.round(evaluation.keyword * 100)}
                />
                <Metric
                    parameter="Semantics"
                    percent={Math.round(evaluation.semantics * 100)}
                />
                <Metric
                    parameter={`Tone: ${evaluation.tone}`}
                    percent={Math.round(evaluation.toneScore * 100)}
                />
                <Metric
                    parameter="Word Count"
                    percent={Math.round(wordCount.student / wordCount.model * 100)}
                />
            </div>
            <div className="Evaluation__feedback">
                <h3 className="Evaluation__feedback__title">Test Results</h3>
                <div className="Evaluation__feedback__result">
                    <div className="Evaluation__feedback__percent">
                        { Math.round(testScore * 100) }%
                        <span>
                            { feedback(Math.round(testScore * 100)) }
                        </span>
                    </div>
                    <div
                        className="Evaluation__feedback__meter"
                    >
                        <div
                            className="Evaluation__feedback__bar"
                            style={{
                                height: `${Math.round(testScore * 100)}%`
                            }}
                        >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Evaluation