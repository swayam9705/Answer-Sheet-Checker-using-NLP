import { createContext, useContext, useState } from "react"

export const FileContext = createContext(null)

export const FileProvider = ({ children }) => {
    const [ fileData, setFileData ] = useState({
        modelFile: null,
        studentFile: [],
        modelExtractedText: "",
        studentExtractedText: ""
    })

    const addStudentFile = file => {
        setFileData(prev => ({...prev, studentFile: [...prev.studentFile, file]}))
    }

    const addModelFile = file => {
        setFileData(prev => ({...prev, modelFile: file}))
    }

    const clearStudentFiles = () => {
        setFileData(prev => ({prev, studentFile: []}))
    }

    const deleteStudentFile = (filename) => {
        setFileData(prev => {
            const filteredStudentFiles = fileData.studentFile.filter(file => file.name != filename)

            return {
                ...prev,
                studentFile: filteredStudentFiles
            }
        })
    }

    const value = {
        fileData,
        addStudentFile,
        addModelFile,
        clearStudentFiles,
        deleteStudentFile
    }

    return (
        <FileContext.Provider value={value}>
            { children }
        </FileContext.Provider>
    )
}

const useFileContext = () => useContext(FileContext)
export default useFileContext