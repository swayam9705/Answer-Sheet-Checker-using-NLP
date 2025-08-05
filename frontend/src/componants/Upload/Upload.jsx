import useFileContext from "../../StateManager/FileContext";

import "./Upload.css"
import Dropbox from "./Dropbox";

const Upload = () => {

    const { fileData } = useFileContext()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (fileData.modelFile) {
            const formData = new FormData()
            formData.append("file", fileData.modelFile)

            try {
                const response = await fetch("http://127.0.0.1:8000/modelFile", {
                    method: 'POST',
                    body: formData
                })

                const result = await response.json()
                console.log(result)

            }
            
            catch (err) {
                console.log("You messed up in uploading file", err)
            }
        }
    }

    return (
        <div className="Upload">
            <h2 className="Upload__title">Upload your answer sheets</h2>
            <div className="Upload__container">
                <Dropbox type="model" />
                <Dropbox type="student" />
            </div>
            <div className="Upload__btn">
                <button
                    onClick={handleSubmit}
                    className="link__btn"
                >Process & Review Extracted Text</button>
            </div>
        </div>
    )
}

export default Upload