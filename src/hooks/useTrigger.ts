import _ from 'lodash';
import { useEffect, useMemo } from 'react';

type AnyFunc = (...args: any) => any;

interface Options {
  debounce?: number;
  throttle?: number;
  options?: _.DebounceSettings | _.ThrottleSettings;
  initial?: boolean;
  cancel?: boolean;
  singleton?: boolean;
}

export let useTrigger = (options: Options, _func: AnyFunc, deps: any[]) => {
  options = options || {};

  let func: AnyFunc | (AnyFunc & _.Cancelable) = useMemo(() => {
    if (options.debounce) {
      return _.debounce(_func, options.debounce, options.options);
    } else if (options.throttle) {
      return _.throttle(_func, options.throttle, options.options);
    } else {
      return _func;
    }
  }, [_func, options.debounce, options.options, options.throttle]);

  useEffect(() => {
    if (options.singleton) {
      if ('cancel' in func) func.cancel();
    }
    func(...deps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (options.initial) {
      if ('cancel' in func) func.cancel();
      _func(...deps);
    }
    return () => {
      if (options.cancel) {
        if ('cancel' in func) func.cancel();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
