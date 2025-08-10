import useFileContext from "../../StateManager/FileContext";
import Dropbox from "./Dropbox";
import UploadedFiles from "./UploadedFiles";

import "./Upload.css"

const Upload = () => {

    const { fileData } = useFileContext()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (fileData.modelFile) {
            const formData = new FormData()

            formData.append("file", fileData.modelFile)

            for (let i = 0; i < fileData.studentFile.length; i++) {
                formData.append("files", fileData.studentFile[i])
            }

            try {
                const sendModelFile = await fetch("http://127.0.0.1:8000/modelFile", {
                    method: 'POST',
                    body: formData
                })
                
                const sendStudentFiles = await fetch("http://127.0.0.1:8000/studentFiles", {
                    method: "POST",
                    body: formData
                })
               

                const modelResult = await sendModelFile.json()
                const studentResult = await sendStudentFiles.json()

                console.log(modelResult)
                console.log(studentResult)

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

            <UploadedFiles />

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