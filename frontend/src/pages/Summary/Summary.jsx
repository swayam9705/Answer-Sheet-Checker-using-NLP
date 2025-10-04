import React, { useEffect } from "react"
import SummaryFileDisplay from "../../componants/SummaryFileDisplay/SummaryFileDisplay"
import NLPResults from "../../componants/NLPResults/NLPResults"

import useFileContext from "../../StateManager/FileContext"

import "./Summary.css"

const Summary = () => {

    try {
        const { fileData } = useFileContext()

        // Debug logging
        console.log("Summary component - fileData:", fileData)
        console.log("Model file:", fileData.modelFile)
        console.log("Student file:", fileData.studentFile)

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
                
                {/* NLP Comparison Section */}
                <NLPResults />
            </div>
        )
    } catch (error) {
        console.error("Error in Summary component:", error)
        return (
            <div className="Summary">
                <h2 className="Summary__title">Error Loading Summary</h2>
                <p>There was an error loading the summary page. Please try again.</p>
                <p>Error: {error.message}</p>
            </div>
        )
    }
}

export default Summary