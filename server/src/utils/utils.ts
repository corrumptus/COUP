export function isObject(arg: any): arg is object {
    return (
        arg !== null &&
        typeof arg === "object" &&
        !Array.isArray(arg)
    );
}

export function isString(arg: any): arg is string {
    return (
        arg !== null &&
        typeof arg === "string"
    );
}

export function isNumber(arg: any): arg is number {
    return (
        arg !== null &&
        typeof arg === "number" &&
        !isNaN(arg)
    );
}