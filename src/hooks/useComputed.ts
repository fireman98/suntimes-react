import { DependencyList, useMemo } from "react"

// Computed with getter/setter, and cached getter value

export default function useComputed<Type> ({ get, set }: { get: () => Type, set: (val: Type) => void }, deps: DependencyList | undefined = []) {

    const memoizedValue = useMemo(() => get(), deps)

    const val = useMemo(() => {
        const obj = {
            get value (): Type {
                return memoizedValue
            },

            set value (val: Type) {
                set(val)
            }
        }
        return obj
    }, [get, set])

    return val
}