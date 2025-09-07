import { createContext, useContext } from "react"

const EvaluationContext = createContext(null)

const EvaluationProvider = ({ children }) => {
    const [ metrics, setMetrics ] = useState({
        keywords: 0,
        semantics: 0,
        otherFactors: 0
    })

    return (
        <EvaluationContext.Privder value={{metrics, setMetrics}}>
            { children }
        </EvaluationContext.Privder>
    )
}

const useEvaluationContext = useContext(EvaluationContext)
export default useEvaluationContext
