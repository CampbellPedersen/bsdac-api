export const isValidString = (value: any) => typeof value === 'string' && value !== '';
export const isZeroOrGreater = (value: any) => typeof value === 'number' && value >= 0;
export const isValidBoolean = (value: any) => typeof value === 'boolean';