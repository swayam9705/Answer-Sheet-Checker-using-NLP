import { useState, useEffect } from "react"
import useFileContext from "../../StateManager/FileContext"

import "./SummaryFileDisplay.css"
import useTextExtractionContext from "../../StateManager/TextExtraction"

const SummaryFileDisplay = ({ type, pdfFile }) => {

    const { fileData } = useFileContext()
    const { extractedText } = useTextExtractionContext()

    const getQualityColor = (score) => {
        if (score >= 0.8) return "#28a745" // Green
        if (score >= 0.6) return "#ffc107" // Yellow
        if (score >= 0.4) return "#fd7e14" // Orange
        return "#dc3545" // Red
    }

    // Handle case where pdfFile might be null
    if (!pdfFile) {
        return (
            <div className="SummaryFileDisplay">
                <h4 className="SummaryFileDisplay__title">{type} Answer Sheet</h4>
                <div className="SummaryFileDisplay__img--container">
                    <p>No file uploaded</p>
                </div>
                <span>Extracted Text:</span>
                <div className="SummaryFileDisplay__extracted--container">
                    <textarea 
                        className="SummaryFileDisplay__extracted--text"
                        value="No text available"
                        readOnly
                        placeholder="No text available"
                    />
                </div>
            </div>
        )
    }

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
            <div className="SummaryFileDisplay__text-header">
                <span>Extracted Text:</span>
                <div className="SummaryFileDisplay__quality-indicator">
                    <span className="quality-label">Quality:</span>
                    <div className="quality-bar">
                        <div 
                            className="quality-fill" 
                            style={{ 
                                width: `${(extractedText.qualityScore || 0) * 100}%`,
                                backgroundColor: getQualityColor(extractedText.qualityScore || 0)
                            }}
                        ></div>
                    </div>
                    <span className="quality-score">
                        {((extractedText.qualityScore || 0) * 100).toFixed(1)}%
                    </span>
                </div>
            </div>
            <div className="SummaryFileDisplay__extracted--container">
                <textarea 
                    className="SummaryFileDisplay__extracted--text"
                    value={type === "Model" ? 
                        (extractedText.model || "No text extracted") :
                        (extractedText.student || "No text extracted")
                    }
                    readOnly
                    placeholder="No text extracted"
                />
            </div>
        
        </div>
    )
}

export default SummaryFileDisplay