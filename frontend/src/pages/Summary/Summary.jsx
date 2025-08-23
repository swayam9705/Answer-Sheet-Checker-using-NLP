import React from "react"
import SummaryFileDisplay from "../../componants/SummaryFileDisplay/SummaryFileDisplay"

import useFileContext from "../../StateManager/FileContext"

import "./Summary.css"

const Summary = () => {

    const { fileData } = useFileContext()

    return (
        <div className="Summary">
            <h2 className="Summary__title">Extracted Answer Text Review</h2>
            <div className="Summary__files--container">
                <SummaryFileDisplay
                    type="Model"
                    imageFile={fileData.modelFile}
                />
                <SummaryFileDisplay
                    type="Student"
                    imageFile={fileData.studentFile}
                />
            </div>
        </div>
    )
}

export default Summary