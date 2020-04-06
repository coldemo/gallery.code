import { useEffect } from 'react';

type AnyFunc = (...args: any) => any;

export let useInterval = (func: AnyFunc, interval: number) => {
  useEffect(() => {
    let id = setInterval(() => {
      func();
    }, interval);
    return () => {
      if (id) clearInterval(id);
    };
  }, [func, interval]);
};
