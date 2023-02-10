export type ValidationParams =
  | 'regexp'
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

export type InputType = 'datetime-local' | 'date' | 'time' | 'text' | 'number';

export interface EventType {
  name: string;
  value: any;
  type?: InputType;
}

export interface ValidationInputType {
  name: string;
  regexp?: RegExp;
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
    regexp?: string;
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
