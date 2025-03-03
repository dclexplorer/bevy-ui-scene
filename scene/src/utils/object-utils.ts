export function deepFreeze<T extends object>(obj: T): T {
    Object.keys(obj).forEach(key => {
        const value = (obj as any)[key];
        if ((Boolean(value)) && typeof value === "object") {
            deepFreeze(value); // Llamada recursiva
        }
    });
    return Object.freeze(obj);
}
