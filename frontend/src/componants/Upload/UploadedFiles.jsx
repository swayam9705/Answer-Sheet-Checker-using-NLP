import useFileContext from "../../StateManager/FileContext"

import { CiFileOn } from "react-icons/ci"
import { RxCrossCircled } from "react-icons/rx"
import { AiOutlineDelete } from "react-icons/ai";

import "./UploadedFiles.css"

const FileComponant = ({ file }) => {
    const getFileType = (file) => {
        if (file.type.startsWith('image/')) return 'Image'
        if (file.type === 'application/pdf') return 'PDF'
        if (file.type.includes('wordprocessingml')) return 'DOCX'
        return 'File'
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <div className="FileComponant">
            <span className="FileComponant__icon file">
                <CiFileOn />
            </span>
            <div className="FileComponant__info">
                <span className="FileComponant__name">
                    { file.name }
                </span>
                <span className="FileComponant__details">
                    {getFileType(file)} • {formatFileSize(file.size)}
                </span>
            </div>
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
                    fileData.studentFile ?
                    <FileComponant key={fileData.studentFile.name} file={fileData.studentFile} />
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