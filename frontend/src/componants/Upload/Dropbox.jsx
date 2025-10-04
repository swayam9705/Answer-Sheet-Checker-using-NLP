import { useEffect, useRef } from "react"
import useFileContext from "../../StateManager/FileContext"

import { CiCirclePlus } from "react-icons/ci"
import { FiUploadCloud } from "react-icons/fi"

import "./Dropbox.css"

const Dropbox = ({ type }) => {

    const inputRef = useRef(null)
    const { fileData, addStudentFile, addModelFile } = useFileContext()
    
    const validateFile = (file) => {
        const allowedTypes = [
            'application/pdf',
            'image/png',
            'image/jpeg',
            'image/jpg',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
        
        const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.docx']
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
        
        if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
            alert(`Invalid file type. Please upload PDF, PNG, JPG, JPEG, or DOCX files only.`)
            return false
        }
        
        // Check file size (max 10MB)
        const maxSize = 10 * 1024 * 1024 // 10MB
        if (file.size > maxSize) {
            alert(`File size too large. Please upload files smaller than 10MB.`)
            return false
        }
        
        return true
    }

    const handleModelFileChange = e => {
        const file = e.target.files[0]
        if (file) {
            if (validateFile(file)) {
                addModelFile(file)
                console.log("Model file uploaded:", file.name, file.type, file.size)
            }
        }
    }

    const handleStudentFileChange = e => {
        const file = e.target.files[0]
        if (file) {
            if (validateFile(file)) {
                addStudentFile(file)
                console.log("Student file uploaded:", file.name, file.type, file.size)
            }
        }
    }

    const handleContainerClick = () => {
        inputRef.current.click()
    }

    return (
        <div
            className="Dropbox"
            onClick={handleContainerClick}
        >
            <input
                onChange={(e) => {
                    if (type === "model") {
                        handleModelFileChange(e)
                    }
                    else {
                        handleStudentFileChange(e)
                    }
                }}
                className="Dropbox__input"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.docx"
                id="fileInput"
                multiple={type !== "model"}
                ref={inputRef}
            />
            <div className="Dropbox__upload-icon">
                <FiUploadCloud />
            </div>
            <div className="Dropbox__title">
                {
                    type === "model" ?
                    <span>Model Answer Sheet</span> :
                    <span>Student Answer Sheet</span>
                }
            </div>
            <p className="Dropbox__desc">
                {
                    type === "model" ?
                    <span>Upload the official answer key (PDF, Image, or DOCX)</span> :
                    <span>Click to upload student submissions (PDF, Image, or DOCX).</span>
                }
            </p>
            <div className="Dropbox__plus-icon">
                <CiCirclePlus />
            </div>
        </div>
    )
}

export default Dropbox