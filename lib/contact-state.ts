import type { ContactField } from './contact-options';

/** Estado que la Server Action le devuelve al formulario (compartido entre servidor y cliente). */
export type ContactState =
  | { status: 'idle' }
  | { status: 'success'; email: string }
  | {
      status: 'error';
      message: string;
      fieldErrors: Partial<Record<ContactField, string>>;
      values: Partial<Record<ContactField, string>>;
    };

export const initialContactState: ContactState = { status: 'idle' };
