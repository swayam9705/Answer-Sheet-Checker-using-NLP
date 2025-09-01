import { useState, useEffect } from "react"
import useFileContext from "../../StateManager/FileContext"

import "./SummaryFileDisplay.css"
import useTextExtractionContext from "../../StateManager/TextExtraction"

const SummaryFileDisplay = ({ type, pdfFile }) => {

    const { fileData } = useFileContext()
    const { extractedText } = useTextExtractionContext()

    const pdfFileUrl = URL.createObjectURL(pdfFile)

    return (
        <div className="SummaryFileDisplay">
            <h4 className="SummaryFileDisplay__title">{type} Answer Sheet </h4>
            <div className="SummaryFileDisplay__img--container">
                {/* Replace the below comment with pdf display */}
                <object
                    className="SummaryFileDisplay__pdfFile"
                    data={pdfFileUrl}
                    type="application/pdf"
                    width="100%"
                    height="400"
                ></object>
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