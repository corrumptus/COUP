export type Converter<T> = {
    [P in keyof T]: T[P] extends object ? Converter<T[P]> : string;
}

export type Differ<T> = {
    [P in keyof T]?: T[P] extends object ? Differ<T[P]> : [T[P], T[P]];
}