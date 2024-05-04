import React from "react";

/**
 * Use this hook as componentDidMount
 */
export const useDidUpdate = (callback: () => void, deps: React.DependencyList | undefined) => {
    const hasMount = React.useRef(false);

    React.useEffect(() => {
        if (hasMount.current) {
            callback();
        } else {
            hasMount.current = true;
        }
    }, deps);
};
