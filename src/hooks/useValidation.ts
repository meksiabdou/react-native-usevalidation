import { useState } from 'react';
import { isEmpty, stringToNumbre } from '../utils/index';
import type {
  EventType,
  MessagesType,
  ValidationInputType,
  ValidationOperators,
  ValidationParams,
} from '../types/index';

const defaultMessages: MessagesType = {
  regExp: 'the {field} is invalid',
  min: '{field} should be more or equal than {min}',
  max: '{field} must be less than or equal to {max}',
  minLength: '{field} should be more than {min} characters',
  maxLength: '{field} must be less than or equal to {max} characters',
  match: 'Be sure to match the {match}',
  required: 'the {field} is required',
  eq: 'Be sure to equal than {field}',
  ne: 'Be sure to not equal to {field}',
  gt: 'Be sure to greater than {field}',
  gte: 'Be sure to greater than or equal to {field}',
  lt: 'Be sure to less than {field}',
  lte: 'Be sure to less than or equal to {field}',
};

const defaultRegex: { email: any; phone: any; url: any } = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  // eslint-disable-next-line no-useless-escape
  phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/i,
  url: /(\b(https?):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/i,
};

const useValidation = (inputs: Array<ValidationInputType>) => {
  const [errors, setErrors] = useState<any>({});
  const [data, setData] = useState<any>({});

  const validation = ({ name, value, type }: EventType) => {
    const errorsList: any = {};
    const results = { status: false, errors: errorsList };
    try {
      const [field] = inputs.filter(
        (item) => item.name.toLowerCase() === name?.toLowerCase()
      );
      if (field) {
        const {
          required,
          match,
          max,
          min,
          maxLength,
          minLength,
          messages,
          //regexp,
          eq,
          ne,
          gt,
          gte,
          lt,
          lte,
        } = field;

        const regExp = field?.regExp || (field as any)?.regexp;

        const getMessage = (
          key: ValidationParams | ValidationOperators,
          _field = name
        ) => {
          return (
            messages?.[key] || defaultMessages?.[key].replace('{field}', _field)
          );
        };

        if (required && isEmpty(value)) {
          results.status = false;
          errorsList[name] = getMessage('required');
        } else if (
          !required &&
          match &&
          data?.[match] &&
          value !== data?.[match]
        ) {
          results.status = false;
          errorsList[name] = getMessage('match').replace('{match}', match);
        } else if (!required && isEmpty(value)) {
          results.status = true;
          errorsList[name] = undefined;
        } else if (
          (regExp || (defaultRegex as any)?.[field?.name]) &&
          !new RegExp(regExp || (defaultRegex as any)?.[field?.name]).test(
            value
          )
        ) {
          results.status = false;
          errorsList[name] = getMessage('regExp');
        } else if (
          !isEmpty(minLength) &&
          !(value.length >= Math.abs(minLength as any))
        ) {
          results.status = false;
          errorsList[name] = getMessage('minLength').replace(
            '{min}',
            Math.abs(minLength as any).toString()
          );
        } else if (
          !isEmpty(maxLength) &&
          !(value.length <= Math.abs(maxLength as any))
        ) {
          results.status = false;
          errorsList[name] = getMessage('maxLength').replace(
            '{max}',
            Math.abs(maxLength as any).toString()
          );
        } else if (!isEmpty(min) && !(Number(value) >= (min as any))) {
          results.status = false;
          errorsList[name] = getMessage('min').replace(
            '{min}',
            (min as any).toString()
          );
        } else if (!isEmpty(max) && !(Number(value) <= (max as any))) {
          results.status = false;
          errorsList[name] = getMessage('max').replace(
            '{max}',
            (max as any).toString()
          );
        } else if (match && data?.[match] && value !== data?.[match]) {
          results.status = false;
          errorsList[name] = getMessage('match').replace(
            '{match}',
            match.toString()
          );
        } else if (!isEmpty(stringToNumbre({ value, type }))) {
          const numbre: any = stringToNumbre({ value, type });
          const getNumbre = (key: any) =>
            stringToNumbre({ value: data?.[key], type }) as any;
          if (eq && !isEmpty(data?.[eq]) && numbre !== getNumbre(eq)) {
            results.status = false;
            errorsList[name] = getMessage('eq', eq);
          } else if (ne && !isEmpty(data?.[ne]) && numbre === getNumbre(ne)) {
            results.status = false;
            errorsList[name] = getMessage('ne', ne);
          } else if (gt && !isEmpty(data?.[gt]) && numbre <= getNumbre(gt)) {
            results.status = false;
            errorsList[name] = getMessage('gt', gt);
          } else if (gte && !isEmpty(data?.[gte]) && numbre < getNumbre(gte)) {
            results.status = false;
            errorsList[name] = getMessage('gte', gte);
          } else if (lt && !isEmpty(data?.[lt]) && numbre >= getNumbre(lt)) {
            results.status = false;
            errorsList[name] = getMessage('lt', lt);
          } else if (lte && !isEmpty(data?.[lte]) && numbre > getNumbre(lte)) {
            results.status = false;
            errorsList[name] = getMessage('lte', lt);
          } else {
            results.status = true;
            [eq, ne, gt, gte, lt, lte].map((i) => {
              if (i) {
                errorsList[i] = undefined;
              }
            });
            errorsList[name] = undefined;
          }
        } else {
          results.status = true;
          errorsList[name] = undefined;
        }
      }
      results.errors = errorsList;
      return results;
    } catch (error) {
      results.status = false;
      console.error(error);
      return results;
    }
  };

  const handelOnSubmit = (
    onSubmit: (status: boolean, currentErrors: Record<any, any>) => void
  ) => {
    try {
      const elements: Array<EventType> = inputs.map((item) => {
        return {
          value: data?.[item?.name]?.toString?.()?.trim?.(),
          name: item?.name,
          type: item?.type,
        };
      });
      const results: Array<{ status: boolean; errors: Record<any, any> }> = [];
      const status: Array<boolean> = [];
      const resultsErrors: any = {};

      elements.map((element, index) => {
        const { value, name, type } = element;
        if (name) {
          results[index] = validation({ name, value, type });
          resultsErrors[name] = results?.[index]?.errors?.[name];
          status[index] = results?.[index]?.status || false;
        }
      });
      const currentErrors = { ...errors, ...resultsErrors };
      setErrors(currentErrors);
      return onSubmit(
        !(results.length === 0 || status.includes(false)),
        currentErrors
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handelOnChange = (event: EventType) => {
    try {
      const name = event?.name;
      const value = event?.value;
      const type = event?.type;

      const results = validation({ name, value, type });

      setErrors({
        ...errors,
        ...results.errors,
      });

      setData({
        ...data,
        [name]: value,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return {
    errors,
    setErrors,
    handelOnSubmit,
    handelOnChange,
    setData,
    data,
  };
};

export default useValidation;
