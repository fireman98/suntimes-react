import { FunctionComponent } from "react"

const Loading: FunctionComponent = () => {
    return (
        <div className="progress state">
            <div className="indeterminate"></div>
        </div>
    )
}

export default Loading