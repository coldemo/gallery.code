import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useCallback, useState } from 'react';

interface PathParams {
  [key: string]: string;
}

type Request = (
  patch?: Partial<
    AxiosRequestConfig & {
      pathParams?: PathParams;
    }
  >
) => Promise<void>;

export interface UseApiObj<T = any, DT = T | null> {
  request: Request;
  error: Error | null;
  response: AxiosResponse<T> | null;
  getData: () => DT;
  loading: boolean;
}

// @todo useMemo config / default
// @todo loading, error

let defaultParseData = (response: AxiosResponse | null) => {
  return response ? response.data : null;
};

export let useApi = <T = any, DT = T>(
  method: AxiosRequestConfig['method'],
  urlPattern: string,
  parseData: (response: AxiosResponse<T> | null) => DT = defaultParseData
): UseApiObj<T, DT> => {
  let [response, setResponse] = useState<AxiosResponse<T> | null>(null);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(null);

  let request: Request = useCallback(
    async (patch = {}) => {
      let pathParams: PathParams = patch.pathParams || Object.create(null);

      let trueUrl = urlPattern.replace(/\/:([^/?#&\d][^/?#&]*)/g, ($0, $1) => {
        return `/${pathParams[$1]}`;
      });

      try {
        setLoading(true);
        let response = await Axios({
          method,
          url: trueUrl,
          ...patch,
        });
        setResponse(response);
        setError(null);
      } catch (err) {
        setResponse(null);
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [method, setResponse, urlPattern]
  );

  let getData = useCallback(() => {
    return parseData(response);
  }, [parseData, response]);

  return { request, error, response, getData, loading };
};
