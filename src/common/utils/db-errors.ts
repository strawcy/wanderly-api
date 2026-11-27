const code = (e: any): string | undefined => e?.code ?? e?.driverError?.code;

export const isDuplicateError = (e: any) => code(e) === 'ER_DUP_ENTRY';
export const isReferencedError = (e: any) =>
  code(e) === 'ER_ROW_IS_REFERENCED_2' || code(e) === 'ER_ROW_IS_REFERENCED';

export const today = () => new Date().toISOString().slice(0, 10);