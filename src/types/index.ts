export type ValidationParams =
  | 'regExp'
  | 'min'
  | 'max'
  | 'minLength'
  | 'maxLength'
  | 'match'
  | 'required';

export type ValidationOperators = 'ne' | 'eq' | 'gt' | 'gte' | 'lte' | 'lt';

export type MessagesType = Record<
  ValidationParams | ValidationOperators,
  string
>;

export type InputType =
  | 'default'
  | 'number-pad'
  | 'decimal-pad'
  | 'numeric'
  | 'email-address'
  | 'phone-pad'
  | 'url'
  | 'ascii-capable'
  | 'numbers-and-punctuation'
  | 'name-phone-pad'
  | 'twitter'
  | 'web-search'
  | 'date'
  | 'visible-password';

export interface EventType {
  name: string;
  value: any;
  type?: InputType;
}

export interface ValidationInputType {
  name: string;
  regExp?: RegExp;
  type?: InputType;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  match?: string;
  eq?: string;
  ne?: string;
  gt?: string;
  gte?: string;
  lt?: string;
  lte?: string;
  messages?: {
    regExp?: string;
    min?: string;
    max?: string;
    match?: string;
    required?: string;
    minLength?: string;
    maxLength?: string;
    eq?: string;
    ne?: string;
    gt?: string;
    gte?: string;
    lt?: string;
    lte?: string;
  };
}
