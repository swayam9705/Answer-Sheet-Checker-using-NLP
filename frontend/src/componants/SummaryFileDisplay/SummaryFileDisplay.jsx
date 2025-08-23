import { useState, useEffect } from "react"
import useFileContext from "../../StateManager/FileContext"

import "./SummaryFileDisplay.css"
import useTextExtractionContext from "../../StateManager/TextExtraction"

const SummaryFileDisplay = ({ type, imageFile }) => {

    const imageUrl = URL.createObjectURL(imageFile)
    const { extractedText } = useTextExtractionContext()

    return (
        <div className="SummaryFileDisplay">
            <h4 className="SummaryFileDisplay__title">{type} Answer Sheet </h4>
            <div className="SummaryFileDisplay__img--container">
                <img
                    className="SummaryFileDisplay__img"
                    src={imageUrl}
                    alt="Answer Sheet Image"
                />
            </div>
            <span>Extracted Text:</span>
            <p className="SummaryFileDisplay__extracted--text">
                { type === "Model" ?
                    extractedText.model :
                    extractedText.student 
                }
            </p>
        </div>
    )
}

export default SummaryFileDisplay