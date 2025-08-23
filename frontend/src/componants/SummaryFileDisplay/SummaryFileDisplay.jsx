import { useState, useEffect } from "react"
import useFileContext from "../../StateManager/FileContext"

import "./SummaryFileDisplay.css"

const SummaryFileDisplay = ({ type, imageFile }) => {

    const imageUrl = URL.createObjectURL(imageFile)

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
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa sequi velit fugit, suscipit fugiat quasi itaque soluta illum, eum voluptas delectus voluptates quis nisi corporis quos nam? Eos, suscipit molestiae?
                Pariatur, perferendis non maxime magni odio laboriosam dolore nobis ut nostrum necessitatibus sed, quas velit autem excepturi porro. Quisquam, quos repellat tempora similique rem nobis odio exercitationem nihil odit. Aperiam?
            </p>
        </div>
    )
}

export default SummaryFileDisplay