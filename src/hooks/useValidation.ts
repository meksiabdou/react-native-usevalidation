import { useState } from 'react';
import { isEmpty, stringToNumber } from '../utils/index';
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

export const defaultValidationRegex: {
  email: any;
  phone: any;
  url: any;
  password: any;
} = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
  url: /(\b(https?):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/i,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&\_\-\x20-\x7E])[A-Za-z\d\W\_\-\x20-\x7E]{8,}$/,
};

const useValidation = (inputs: Array<ValidationInputType>) => {
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [data, setData] = useState<Record<string, any>>({});

  const validation = ({ name, value, type }: EventType) => {
    const errorsList: Record<string, any> = {};
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
          (regExp || (defaultValidationRegex as any)?.[field?.name]) &&
          !new RegExp(regExp || (defaultValidationRegex as any)?.[field?.name]).test(
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
        } else if (!isEmpty(stringToNumber({ value, type }))) {
          const number: any = stringToNumber({ value, type });
          const getNumber = (key: any) =>
            stringToNumber({ value: data?.[key], type }) as any;
          if (eq && !isEmpty(data?.[eq]) && number !== getNumber(eq)) {
            results.status = false;
            errorsList[name] = getMessage('eq', eq);
          } else if (ne && !isEmpty(data?.[ne]) && number === getNumber(ne)) {
            results.status = false;
            errorsList[name] = getMessage('ne', ne);
          } else if (gt && !isEmpty(data?.[gt]) && number <= getNumber(gt)) {
            results.status = false;
            errorsList[name] = getMessage('gt', gt);
          } else if (gte && !isEmpty(data?.[gte]) && number < getNumber(gte)) {
            results.status = false;
            errorsList[name] = getMessage('gte', gte);
          } else if (lt && !isEmpty(data?.[lt]) && number >= getNumber(lt)) {
            results.status = false;
            errorsList[name] = getMessage('lt', lt);
          } else if (lte && !isEmpty(data?.[lte]) && number > getNumber(lte)) {
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
      if(results.errors) {
        results.errors.system = error?.toString?.()
      }
      return results;
    }
  };

  const handleOnSubmit = (
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
      return onSubmit(
        false,
        {system: error?.toString?.()}
      );
    }
  };

  const handleOnChange = (event: EventType) => {
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

    }
  };

  return {
    errors,
    setErrors,
    handleOnSubmit,
    handleOnChange,
    setData,
    data,
  };
};

export default useValidation;
