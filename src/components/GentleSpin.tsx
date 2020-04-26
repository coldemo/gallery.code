import { Spin } from 'antd';
import { SpinProps } from 'antd/lib/spin';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';

type UseGentle = <T = any>(v: T) => T;

let useGentle: UseGentle = _value => {
  let [value, setValue] = useState(_value);

  let debouncedSetValue = useMemo(() => {
    return _.debounce(setValue, 1000, {
      leading: true,
      trailing: true,
    });
  }, []);

  useEffect(() => {
    if (_value) {
      setValue(_value);
    } else {
      debouncedSetValue(_value);
    }
    return () => {
      debouncedSetValue.cancel();
    };
  }, [_value, debouncedSetValue]);

  return value;
};

export let GentleSpin: React.FC<SpinProps> = props => {
  let { spinning: _spinning, ...rest } = props;

  let spinning = useGentle(_spinning); // todo

  return <Spin {...{ ...rest, spinning }} />;
};
