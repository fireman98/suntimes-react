export function radians_to_degrees (radians: number) {
    const pi = Math.PI
    return radians * (180 / pi)
}

export function formatTime (date: Date) {
    const hour = date.getHours()
    const minute = date.getMinutes()

    return `${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute
        } `
}

export function debounce<FunctionType extends (...args: any) =>
    any, ThisType> (fv: FunctionType, ms: number) {
    let timeoutTask: NodeJS.Timeout | undefined
    let result: ReturnType<FunctionType>
    return function (this: ThisType, ...args: Parameters<FunctionType>) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const context = this
        const Args = args
        function executeFunction () {
            timeoutTask = undefined
            result = fv.apply(context, Args)
        }
        return (clearInterval(timeoutTask), timeoutTask = setTimeout(executeFunction, ms), result)
    }
}