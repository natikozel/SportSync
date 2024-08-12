export function isEmail(value: string): boolean {
    return value.includes('@');
}

export function isNotEmpty(value: string): boolean {
    return value.trim() !== '';
}