import { useEffect } from "react"
import { useNavigate } from "react-router"
import Hero from "../../componants/Hero/Hero"
import Upload from "../../componants/Upload/Upload"
import Working from "../../componants/Working/Working"

import useFileContext from "../../StateManager/FileContext"
import useTextExtractionContext from "../../StateManager/TextExtraction"

const Home = () => {
    const navigate = useNavigate()
    const { fileData } = useFileContext()
    const { extractedText } = useTextExtractionContext()

    // If we have both files and extracted text, redirect to summary
    useEffect(() => {
        if (fileData.modelFile && fileData.studentFile && 
            extractedText.model && extractedText.student) {
            navigate('/summary', { replace: true })
        }
    }, [fileData, extractedText, navigate])

    return (
        <div className="Home">
            <Hero />
            <Upload />
            <Working />
        </div>
    )
}

export default Home