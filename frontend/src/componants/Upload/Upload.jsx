import { useNavigate } from "react-router"
import { useState } from "react"

import useFileContext from "../../StateManager/FileContext";
import Dropbox from "./Dropbox";
import UploadedFiles from "./UploadedFiles";

import "./Upload.css"
import useTextExtractionContext from "../../StateManager/TextExtraction";

const Upload = () => {

    const navigation = useNavigate()
    const [isProcessing, setIsProcessing] = useState(false)
    const [processingStatus, setProcessingStatus] = useState("")
    const [error, setError] = useState(null)

    const { fileData } = useFileContext()
    const { setModelText, setStudentText } = useTextExtractionContext()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!fileData.modelFile || !fileData.studentFile) {
            setError("Please upload both model and student files before processing.")
            return
        }

        setIsProcessing(true)
        setError(null)
        setProcessingStatus("Initializing text extraction...")

        console.log("Processing files:")
        console.log("Model file:", fileData.modelFile.name, fileData.modelFile.type)
        console.log("Student file:", fileData.studentFile.name, fileData.studentFile.type)

        const formData1 = new FormData()
        const formData2 = new FormData()

        formData1.append("file", fileData.modelFile)
        formData2.append("file", fileData.studentFile)

        try {
            setProcessingStatus("Extracting text from model file...")
            console.log("Sending model file to backend...")
            const sendModelFile = await fetch("http://127.0.0.1:8000/extractFileText", {
                method: 'POST',
                body: formData1
            })
            
            if (!sendModelFile.ok) {
                throw new Error(`Model file processing failed: ${sendModelFile.status}`)
            }
            
            setProcessingStatus("Extracting text from student file...")
            console.log("Sending student file to backend...")
            const sendStudentFiles = await fetch("http://127.0.0.1:8000/extractFileText", {
                method: "POST",
                body: formData2
            })
            
            if (!sendStudentFiles.ok) {
                throw new Error(`Student file processing failed: ${sendStudentFiles.status}`)
            }
           
            setProcessingStatus("Processing extracted text...")
            const modelResult = await sendModelFile.json()
            const studentResult = await sendStudentFiles.json()

            console.log("Model result:", modelResult)
            console.log("Student result:", studentResult)

            // Check for errors in results
            if (modelResult.error) {
                throw new Error(`Model file error: ${modelResult.error}`)
            }
            if (studentResult.error) {
                throw new Error(`Student file error: ${studentResult.error}`)
            }

            if (modelResult.extracted_text && modelResult.extracted_text !== "No text extracted") {
                setModelText(modelResult.extracted_text)
                console.log("Model text set successfully")
                console.log("Model text quality:", modelResult.text_quality)
            } else {
                console.log("No model text extracted")
                setError("Failed to extract text from model file. Please try a different file.")
                return
            }

            if (studentResult.extracted_text && studentResult.extracted_text !== "No text extracted") {
                setStudentText(studentResult.extracted_text)
                console.log("Student text set successfully")
                console.log("Student text quality:", studentResult.text_quality)
            } else {
                console.log("No student text extracted")
                setError("Failed to extract text from student file. Please try a different file.")
                return
            }

            setProcessingStatus("Text extraction completed successfully!")
            setTimeout(() => {
                navigation("/summary")
            }, 1000)

        } catch (err) {
            console.error("Error processing files:", err)
            setError(err.message || "Error processing files. Please check the console for details.")
        } finally {
            setIsProcessing(false)
            setProcessingStatus("")
        }
    }

    return (
        <div className="Upload" id="Upload">
            <h2 className="Upload__title">Upload your answer sheets</h2>
            <div className="Upload__container">
                <Dropbox type="model" />
                <Dropbox type="student" />
            </div>

            <UploadedFiles />

            {/* Error Display */}
            {error && (
                <div className="Upload__error">
                    <h4>❌ Error</h4>
                    <p>{error}</p>
                    <button 
                        className="Upload__error-close"
                        onClick={() => setError(null)}
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Processing Status */}
            {isProcessing && (
                <div className="Upload__processing">
                    <div className="Upload__spinner"></div>
                    <p className="Upload__status">{processingStatus}</p>
                </div>
            )}

            <div className="Upload__btn">
                <button
                    onClick={handleSubmit}
                    className="link__btn"
                    disabled={isProcessing || !fileData.modelFile || !fileData.studentFile}
                >
                    {isProcessing ? "🔄 Processing..." : "🔍 Process & Review Extracted Text"}
                </button>
            </div>

            {/* File Requirements */}
            <div className="Upload__requirements">
                <h4>📋 Supported File Types:</h4>
                <ul>
                    <li>📄 PDF files (text-based or scanned)</li>
                    <li>🖼️ Image files (PNG, JPG, JPEG)</li>
                    <li>📝 Word documents (DOCX)</li>
                </ul>
                <p><strong>Note:</strong> For best results, use clear, high-quality images or text-based PDFs.</p>
            </div>
        </div>
    )
}

export default Upload