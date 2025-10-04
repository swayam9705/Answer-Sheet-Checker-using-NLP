import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import "./EvaluationSkeleton.css"

const MetricSkeleton = () => {
    return (
        <div className="MetricSkeleton">
            <Skeleton
                className="MetricSkeleton__container"
                width={800}
                height={80} 
            />
            <div
                className="MetricSkeleton__meter"
            >
            </div>
        </div>
    )
}

const EvaluationSkeleton = () => {
    return <div className="EvaluationSkeleton">
        <div className="Evaluation__title">
            Student Test Summary
        </div>
        <div className="Skeletons">
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
        </div>
    </div>
}

export default EvaluationSkeleton