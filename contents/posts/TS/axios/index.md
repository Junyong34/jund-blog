---
title: "axios + react-query 타입과 함께 사용하기(1)"
description: "axios 셋팅하기"
date: 2023-07-24
update: 2023-07-24
tags:
  - typescript
  - axios
  - ts
  - react-query
series: "axios + react-query + typescript"
---

백앤드와 데이터를 주고 받을때 axios를 사용하여 통신하고, 서버 상태 관리를 react-query를 사용 합니다. 다만 타입을 제대로 지정 하고 있지 않아서 이번 기회에 타입을 넣는 부분에 대하여 이야기 해보려고 합니다.

> axios 는 1.4.0 버전을 사용 했습니다.


# Axios 설정하기

axios 사용하면서 4가지 설정을 통해서 사용하게 됩니다.

1. axios config 설정하기
2. interceptor 설정하기
3. create axios 생성하기
4. base axios Instance 생성하기

## axios config  설정 파일

Axios의 configs는 Axios 인스턴스를 생성할 때 사용되며, HTTP 요청의 기본 설정을 정의하는 데에 쓰입니다. 이러한 설정들은 해당 Axios 인스턴스로 보내는 모든 HTTP 요청에 적용됩니다. 예를 들면 axios config에 대한 headers 설정 및 baseURL, timeout등 설정을 합니다.

```tsx
const url = `${`https://host:port`}`;
export const baseURL = `${url}`;

const axiosDefaultConfig = {
    headers: {},
    baseURL,
    timeout: 40000
};

export default axiosDefaultConfig;
```

## interceptor 설정하기

axios interceptor는 HTTP 요청과 응답을 가로채서 원하는 대로 처리할 수 있도록 해주는 중간 매개체입니다. 이를 통해 전역적으로 HTTP 요청과 응답을 조작하거나 특정 상황에 맞게 추가적인 로직을 수행할 수 있습니다. 예를 들면 Token 처리,에러처리, 로딩 처리 등등 활용 할 수 있습니다.

```tsx
import {
    AxiosInstance,
    AxiosInterceptorManager,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig
} from 'axios';
import { logOnDev } from './createAxiosIns';
import { onErrorHandler } from './axiosError';

type RequestInterceptor = AxiosInterceptorManager<AxiosRequestConfig>;
type ResponseInterceptor = AxiosInterceptorManager<AxiosResponse>;

const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const { method, url } = config;

		console.log(`🚀 [API-request] ${method} ${url} `);
    return config;
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
    const { method, url } = response.config;
    const { status, config, data } = response;

		console.log(`🚀 [API-response] ${method} ${url} = ${status}`);

    return response;
};

export const setupInterceptors = (instance: AxiosInstance): AxiosInstance => {
    instance.interceptors.request.use(onRequest, onErrorHandler);
    instance.interceptors.response.use(onResponse, onErrorHandler);

    return instance;
};
```

```tsx
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export const onErrorHandler = (error: AxiosError | Error): Promise<AxiosError> => {
    if (axios.isAxiosError(error)) {
        const { message } = error;
        const { method, url } = error.config as AxiosRequestConfig;
        const { statusText, status } = (error.response as AxiosResponse) ?? {};

        const errors: Record<number, string> = {
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Not Found',
            500: 'Internal Server Error',
            502: 'Bad Gateway',
            503: 'Service Unavailable'
        };

        const baseErrorMsg = errors[status] || 'Unknown error occurred';

        console.log(
            `⛔️ [API] ${method?.toUpperCase()} ${url} = Error ${baseErrorMsg} ${status} ${message} ${statusText}`
        );

        if (status === 401) {
            // 토큰 및 권한 에러
        }
    } else {
        console.log(`⛔️ [API] | Error :: ${error.message}`);
    }

    return Promise.reject(error);
};
```

## createAxios

Axios의 `create` 메서드는 새로운 Axios 인스턴스를 생성하는 역할을 합니다. Axios 인스턴스는 기본적으로 Axios 라이브러리의 모든 기능과 설정을 가지고 있으며, 해당 인스턴스를 사용하여 HTTP 요청을 보낼 수 있습니다.

다양한 API 엔드포인트에 대한 Axios 인스턴스를 생성하면, 코드를 모듈화하여 API 요청을 관리할 수 있습니다.

예를들어 여러 백앤드에 대하여 각각 독립적으로 인스턴스를 생성해서 사용할 수 있습니다.

```tsx
import qs from 'query-string';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export const logOnDev = (message: string) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(message);
    }
};

export const createAxiosInstance = (config: AxiosRequestConfig) => {
    const { headers } = config;
    return axios.create({
        withCredentials: true,
        headers: {
            ...(headers ? headers : {}),
            'Content-Type': 'application/json'
            // 'Access-Control-Allow-Origin': '*'
        },
        paramsSerializer: params => {
            return qs.stringify(params, { arrayFormat: 'bracket' });
        },
        ...config
        // paramsSerializer: (params: any) => qs.stringify(snakeKeys(params)),
    });
};
```

## Axios Instanct

`InsAxios`라는 클래스를 정의하고, Axios 인스턴스를 활용하여 HTTP 요청을 간편하게 수행하는 유틸리티 클래스입니다.

```tsx
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

export default class InsAxios {
  // Api servers
  private instance
  constructor(axiosIns: AxiosInstance) {
    this.instance = axiosIns
  }

  public async get<T = unknown, U = undefined>(path: string, params?: U) {
    try {
      const { data: res } = await this.instance.get<T>(path, {
        params,
      })
      return res
    } catch (error) {
      throw error // 예외를 던져서 다른 곳에서 처리하도록 함
    }
  }

  public async post<T = unknown, U = undefined>(key: string, params?: U, config?: AxiosRequestConfig) {
    try {
      const { data: res } = await this.instance.post<T>(key, params, config)
      return res
    } catch (error) {
      throw error // 예외를 던져서 다른 곳에서 처리하도록 함
    }
  }

  public async put<T = unknown, U = undefined>(key: string, params: U) {
    try {
      const { data: res } = await this.instance.put<T>(key, params)
      return res
    } catch (error) {
      throw error // 예외를 던져서 다른 곳에서 처리하도록 함
    }
  }

  public async patch<T = unknown, U = undefined>(key: string, params: U) {
    try {
      const { data: res } = await this.instance.patch<T>(key, params)
      return res
    } catch (error) {
      throw error // 예외를 던져서 다른 곳에서 처리하도록 함
    }
  }

  public async delete<T>(key: string, params?: T) {
    try {
      const { data: res } = await this.instance.delete(key, { params })
      return res
    } catch (error) {
      throw error // 예외를 던져서 다른 곳에서 처리하도록 함
    }
  }

	public static setAccessToken(token: string) {
	    this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
	  }
	
	  public static setRefreshToken(token: string) {
	    setItem(LocalStorageKey.REFRESH_TOKEN, token)
	  }
	  public static storybookTokenInject() {
	    Instance.setAccessToken(import.meta.env.VITE_STORYBOOK_TOKEN)
	  }
}
```

# axios + typescript 사용하기

앤드포인트 URL을 넣어주는 axios인스턴스를 하나 생성 합니다.

```jsx
export const httpClient = new InsAxios(setupInterceptors(createAxiosInstance(axiosDefaultConfig)));
```

`httpClient` 에 제네릭 타입을 넣어 res,req에 대한 타입을 추론 및 타입 가드를 사용 합니다.

```tsx
export type SuccessRes<T> = {
  success: true
  code: string
  message: string
  data: T
}

export type LoginReq = {
  username: string
  password: string
  otp: string
}

export type LoginRes = {
  username: string
  accessToken: string
  refreshToken: string
}

const params = {

}
const loginFetch = await httpClient.get<SuccessRes<LoginRes>, LoginReq>(
  loginPath.getLogin, params
);
```

제네릭 타입에 대한 부분은 위에서 정의한 `get<T = unknown, U = undefined>(path: string, params?: U)`에서 T는 타입이 정의되지 않으면 `unknown` 타입으로 사용됩니다. 이 부분에서 타입에 대한 정의가 누락되면 타입 에러가 표시됩니다. U는 기본 타입으로는 `undefined`로, 파라미터가 없는 API와 같은 경우는 별다른 타입 체크가 이루어지지 않습니다. 하지만 U 타입을 정의하게 되면 해당 타입에 대한 params 타입이 체크됩니다.

`httpClient.get<SuccessRes<LoginRes>, LoginReq>`으로 res와 req의 제네릭 타입을 지정합니다. 이렇게 하면 response에 대한 값 확인이 가능하며, 타입 추론을 통해 `.`을 찍어도 해당 loginFetch에 대한 res 객체 정보가 추론됩니다. 또한 req 제네릭 타입으로 params가 필요한 API의 경우, 타입 체크가 이루어져 필수 파라미터가 누락되면 에러 표시가 나옵니다.


# axios + typescript
앞으로 axios를 사용하면서 타입에 대한 에러를 최소화 하기 위해, axios를 사용하는 모든 곳에서 제네릭 타입을 지정하고, res, req에 대한 타입 추론을 활용하여
오타도 줄이고 타입 에러도 최소화 하도록 합시다.

