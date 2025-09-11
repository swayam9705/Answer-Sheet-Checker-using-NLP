import React, { useEffect } from "react"
import { useNavigate } from "react-router"
import SummaryFileDisplay from "../../componants/SummaryFileDisplay/SummaryFileDisplay"
import Evaluation from "../../componants/Evaluation/Evaluation"

import useFileContext from "../../StateManager/FileContext"
import useTextExtractionContext from "../../StateManager/TextExtraction"

import "./Summary.css"

const Summary = () => {
    const navigate = useNavigate()
    const { fileData } = useFileContext()
    const { extractedText } = useTextExtractionContext()

    // Redirect to home if no files are available (e.g., direct navigation or after clearing data)
    useEffect(() => {
        if (!fileData.modelFile || !fileData.studentFile) {
            navigate('/', { replace: true })
        }
    }, [fileData, navigate])

    // Show loading state while checking data
    if (!fileData.modelFile || !fileData.studentFile) {
        return (
            <div className="Summary">
                <div className="loading">Loading your files...</div>
            </div>
        )
    }

    return (
        <div className="Summary">
            <h2 className="Summary__title">Extracted Answer Text Review</h2>
            <div className="Summary__files--container">
                <SummaryFileDisplay
                    type="Model"
                    pdfFile={fileData.modelFile}
                />
                <SummaryFileDisplay
                    type="Student"
                    pdfFile={fileData.studentFile}
                />
            </div>
            <Evaluation />
        </div>
    )
}

export default Summary