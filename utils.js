
//Run javascript function when user finishes typing instead of on key up? DEBOUNCING
const debounce = (func, delay = 1000) => {
        let timeoutId;
        return (...args) => {
                if (timeoutId) {
                        clearTimeout(timeoutId)
                }

                timeoutId = setTimeout(() => {
                        func.apply(null, args);
                }, delay)
        }
}