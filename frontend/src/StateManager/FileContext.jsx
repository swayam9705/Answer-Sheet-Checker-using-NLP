import { createContext, useContext, useState } from "react"

export const FileContext = createContext(null)

export const FileProvider = ({ children }) => {
    const [ fileData, setFileData ] = useState({
        modelFile: null,
        studentFile: []
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

    const value = {
        fileData,
        addStudentFile,
        addModelFile,
        clearStudentFiles
    }

    return (
        <FileContext.Provider value={value}>
            { children }
        </FileContext.Provider>
    )
}

const useFileContext = () => useContext(FileContext)
export default useFileContext