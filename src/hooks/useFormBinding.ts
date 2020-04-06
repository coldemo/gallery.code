import { useCallback, useMemo, useState } from 'react';

type ParseValue<T> = (...args: any[]) => T;

// @todo uncontrolled / defaultValue

export let useFormBinding = <T>(_initial: T, _parseValue?: ParseValue<T>) => {
  let defaultParseValue: ParseValue<T> = useCallback(e => {
    let r = e;
    if (e && e.target && 'value' in e.target) {
      r = e.target.value;
    }
    return r;
  }, []);

  let [initial, parseValue] = useMemo(() => {
    return [_initial, _parseValue || defaultParseValue];
  }, [_initial, _parseValue, defaultParseValue]);

  let [value, setValue] = useState<T>(initial);

  let handleChange = useCallback(
    (e, ...rest) => {
      let r = parseValue(e, ...rest);
      setValue(r);
    },
    [parseValue]
  );

  let controlled = {
    value,
    onChange: handleChange,
  };

  return { value, controlled };
};
