import { createContext, useContext, useState, useEffect } from "react"

export const FileContext = createContext(null)

export const FileProvider = ({ children }) => {
    const [ fileData, setFileData ] = useState({
        modelFile: null,
        studentFile: null,
        modelExtractedText: "",
        studentExtractedText: ""
    })

    // Load data from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem('fileData')
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData)
                setFileData(parsed)
            } catch (error) {
                console.error('Error loading saved file data:', error)
            }
        }
    }, [])

    // Save data to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('fileData', JSON.stringify(fileData))
    }, [fileData])

    const addStudentFile = file => {
        setFileData(prev => ({...prev, studentFile: file}))
    }

    const addModelFile = file => {
        setFileData(prev => ({...prev, modelFile: file}))
    }

    const value = {
        fileData,
        addStudentFile,
        addModelFile
    }

    return (
        <FileContext.Provider value={value}>
            { children }
        </FileContext.Provider>
    )
}

const useFileContext = () => useContext(FileContext)
export default useFileContext