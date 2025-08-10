import useFileContext from "../../StateManager/FileContext"

import { CiFileOn } from "react-icons/ci"
import { RxCrossCircled } from "react-icons/rx"
import { AiOutlineDelete } from "react-icons/ai";

import "./UploadedFiles.css"

const FileComponant = ({ file }) => {
    return (
        <div className="FileComponant">
            <span className="FileComponant__icon file">
                <CiFileOn />
            </span>
            <span className="FileComponant__name">
                { file.filename } { file.name }
            </span>
            <span className="FileComponant__icon delete">
                <AiOutlineDelete />
            </span>
        </div>
    )
}

const UploadedFiles = () => {

    const { fileData } = useFileContext()

    return (
        <div className="UploadedFiles">

            <div className="UploadedFiles__section">
                <div className="UploadedFiles__title">Model File</div>
                {
                    fileData.modelFile ? 
                    <FileComponant file={fileData.modelFile} type="model" />
                    :
                    <span className="UploadedFiles__msg">
                        <RxCrossCircled />
                        No file is uploaded
                    </span>
                }
            </div>
            <div className="UploadedFiles__section">
                <div className="UploadedFiles__title">Answer Sheets Files</div>
                {
                    fileData.studentFile.length > 0 ?
                    fileData.studentFile.map(file => <FileComponant key={file.name} file={file} />)
                    :
                    <span className="UploadedFiles__msg">
                        <RxCrossCircled />
                        No file is uploaded
                    </span>
                }
            </div>
        </div>
    )
}

export default UploadedFiles