---
title: "axios + react-query 타입과 함께 사용하기(2)"
description: "react-query 셋팅하기"
date: 2023-07-24
update: 2023-07-24
tags:
  - typescript
  - axios
  - ts
  - react-query
series: "axios + react-query + typescript"
---

## react-query 란

react-query는 캐싱 및 서버 상태 관리를 자동으로 처리하여 비동기 데이터 요청을 관리를 하는 라이브러리 입니다.  axios + react-query 조합을 사용하여 API를 호출하고 호출 된 데이터를 캐싱처리 하며, 또 userQuery에 대한 제네릭 타입도 어떤식으로 설정해서 사용하는지 확인 합니다.

> react-query v4를 사용 했습니다.
>

## useQuery

useQuery는 react-useQuery는 웹 애플리케이션에서 데이터를 서버로부터 가져오는데 사용되는 React 훅입니다. REST API 같은 서버에서 데이터를 가져오는데 사용하게 됩니다.

또 캐싱과 리패칭 기능을 지원하여 최적화된 데이터 가져오기를 할 수 있습니다.

useQuery 타입은 아래와 같이 정의 되어있습니다.

```tsx
export declare function useQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> ....
```

1. TQueryFnData:
    - TQueryFnData는 데이터를 가져오는 함수의 반환 값에 해당하는 타입입니다.
    - 이 타입은 서버로부터 요청한 데이터의 형식을 나타냅니다.
    - response에 타입이 됩니다.
2. TError:
    - TError는 에러 발생 시 사용되는 타입입니다.
    - useQuery가 데이터를 가져오는 과정에서 에러가 발생하면 이 타입에 정의된 형식으로 에러 정보가 담기게 됩니다.
    - 백앤드에서 정의한 Error 타입을 사용하게 됩니다.
3. TData:
    - TData는 useQuery 함수가 반환하는 데이터 객체의 타입입니다.
    - useQuery가 성공적으로 데이터를 가져오면 해당 데이터가 TData 타입으로 반환됩니다.
    - TData 타입을 지정하지 않으면 기본으로 TQueryFnData 타입이 됩니다. `TData = TQueryFnData`
    - select option를 통해 데이터를 가공하는 경우 타입이 되기도 합니다.
4. TQueryKey:
    - TQueryKey는 useQuery 함수에 전달되는 쿼리 키(Query Key)의 타입을 나타냅니다.
    - 쿼리 키는 useQuery가 서버에 요청할 때 사용되는 매개변수로, 이를 통해 서버에서 필요한 데이터를 식별합니다.
    - `type QueryKey = string | readonly unknown[];`

## useQuery + Axios 타입 랩핑하기

React app에서 데이터를 가져오는 데 사용되는 `@tanstack/react-query` 라이브러리와 `axios`를 이용한 커스텀 훅인 `useQueryWrap`을 정의하는 TypeScript 코드입니다.

```tsx
import { useQuery, UseQueryOptions, UseQueryResult, QueryKey } from '@tanstack/react-query';
import { AxiosError } from 'axios';

type ParamsType<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

export const useQueryWrap = <ResData, ErrorResData = unknown, U = ResData>(
    queryKey: QueryKey,
    query: (...args: any) => Promise<ResData>,
    options?: UseQueryOptions<ResData, AxiosError<ErrorResData>, U>
): UseQueryResult<U, AxiosError<ErrorResData>> => {
    // Inside the useQuery hook, unpack the `args` tuple into separate arguments
    return useQuery<ResData, AxiosError<ErrorResData>, U>(
        queryKey,
        (...args: ParamsType<typeof query>) => query(...args),
        {
            retry: false,
            ...options
        }
    );
};
```

1. `ParamsType`이라는 제네릭 타입을 정의합니다. 이 함수는 함수 타입 `T`가 가변인자를 받는 함수인 경우 해당 가변인자의 타입을 추출해내는 역할을 합니다.
2. `useQueryWrap` 함수를 정의합니다. 이 함수는 세 개의 제네릭 타입 매개변수를 받습니다.
    - `ResData`: 요청을 통해 받아온 데이터의 타입을 나타냅니다.
    - `ErrorResData`: 요청이 실패했을 때 받아온 에러 데이터의 타입을 나타냅니다. 기본값으로 `unknown`이 설정되어 있습니다.
    - `U`: 최종적으로 반환되는 데이터의 타입을 나타냅니다. 기본값으로 `ResData`와 동일한 타입이 설정되어 있습니다.
3. `useQueryWrap` 함수 내부에서는 `useQuery`를 호출하여 실제 데이터를 가져오는 로직을 구현합니다.
    - `useQuery` 함수는 요청을 위한 쿼리키(`queryKey`), 데이터를 가져오는 비동기 함수(`query`), 그리고 추가적인 옵션들(`options`)을 매개변수로 받습니다.
    - 여기서 `queryKey`, `query`, `options` 매개변수는 `useQueryWrap` 함수의 매개변수와 동일합니다.
    - `useQuery` 함수 내에서는 기본적으로 `retry` 옵션이 `false`로 설정되며, 이후 `options` 객체의 내용을 덮어씌우기 위해 스프레드 연산자를 사용합니다.
    - 가장 중요한 부분은 `query` 함수를 호출할 때 가변인자를 사용하는 것입니다. 이를 위해 `ParamsType<typeof query>`를 사용하여 `query` 함수의 매개변수 타입을 추출하고, 이를 `useQuery` 함수에 전달합니다.
4. 마지막으로 `useQueryWrap` 함수의 반환 타입은 `UseQueryResult<U, AxiosError<ErrorResData>>`로 설정되어 있습니다. 따라서 커스텀 훅을 사용하여 데이터를 가져올 때 `U` 타입으로 데이터를 다루고, 에러 시에는 `AxiosError<ErrorResData>` 타입으로 에러를 다루게 됩니다.

`useQuery`는 선언적인 문법을 사용하여 데이터를 가져오고 관리합니다.  비동기 요청을 직접 관리하는 대신 `useQuery` 훅을 사용하여 데이터를 요청하고 상태를 추적할 수 있습니다.

## useMutation + Axios 타입 랩핑하기

React App에서 데이터를 변경하는 데 사용되는 `@tanstack/react-query` 라이브러리와 `axios`를 이용한 커스텀 훅인 `useMutationWrap`을 정의하는 TypeScript 코드입니다.

```tsx
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';

type ParamsType<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;

export const useMutationWrap = <ResData, ErrorResData = unknown, U = ResData>(
    mutation: (...args: any) => Promise<ResData>,
    options?: UseMutationOptions<ResData, AxiosError<ErrorResData>, ParamsType<typeof mutation>>
): UseMutationResult<ResData, AxiosError<ErrorResData>, ParamsType<typeof mutation>> => {
    return useMutation<ResData, AxiosError<ErrorResData>, ParamsType<typeof mutation>, unknown>(
        (...args: ParamsType<typeof mutation>) => mutation(...args),
        {
            retry: false,
            ...options
        }
    );
};
```

1. `ParamsType`이라는 제네릭 타입을 정의합니다. 이 함수는 함수 타입 `T`가 가변인자를 받는 함수인 경우 해당 가변인자의 타입을 추출해내는 역할을 합니다.
2. `useMutationWrap` 함수를 정의합니다. 이 함수는 두 개의 제네릭 타입 매개변수를 받습니다.
    - `ResData`: 뮤테이션(데이터 변경)을 통해 받아온 데이터의 타입을 나타냅니다.
    - `ErrorResData`: 뮤테이션 실행이 실패했을 때 받아온 에러 데이터의 타입을 나타냅니다. 기본값으로 `unknown`이 설정되어 있습니다.
    - `U`: 최종적으로 반환되는 데이터의 타입을 나타냅니다. 기본값으로 `ResData`와 동일한 타입이 설정되어 있습니다.
3. `useMutationWrap` 함수 내부에서는 `useMutation`을 호출하여 실제 데이터를 변경하는 로직을 구현합니다.
    - `useMutation` 함수는 데이터 변경을 위한 비동기 함수(`mutation`)와 옵션들(`options`)을 매개변수로 받습니다.
    - 여기서 `mutation`과 `options` 매개변수는 `useMutationWrap` 함수의 매개변수와 동일합니다.
    - `useMutation` 함수 내에서는 기본적으로 `retry` 옵션이 `false`로 설정되며, 이후 `options` 객체의 내용을 덮어씌우기 위해 스프레드 연산자를 사용합니다.
    - 가장 중요한 부분은 `mutation` 함수를 호출할 때 가변인자를 사용하는 것입니다. 이를 위해 `ParamsType<typeof mutation>`을 사용하여 `mutation` 함수의 매개변수 타입을 추출하고, 이를 `useMutation` 함수에 전달합니다.
4. 마지막으로 `useMutationWrap` 함수의 반환 타입은 `UseMutationResult<ResData, AxiosError<ErrorResData>, ParamsType<typeof mutation>>`로 설정되어 있습니다. 따라서 커스텀 훅을 사용하여 데이터를 변경할 때 `ResData` 타입으로 데이터를 다루고, 에러 시에는 `AxiosError<ErrorResData>` 타입의 에러를 다루게 됩니다.

`useMutation` 명령형 방식으로 데이터를 변경하는 데 사용되는 훅입니다. `useMutation` 훅을 사용하여 새로운 데이터를 서버에 추가하는 경우, 데이터를 전달하고, 서버의 응답을 확인하여 성공 또는 실패에 대한 액션을 직접 처리해야 합니다.

# 예제를 통해 코드 작성하기

## useQueryWrap

```tsx
const { data } = useQueryWrap<resCategoryInfo, any, number>(
        ['fetch', 'test'],
        () =>
            httpClient.get<resCategoryInfo, reqCategoryDto>(
                CategoryPath.getCategoryInfo,
                { cd: 2007 }
            ),
        {
            refetchOnWindowFocus: false,
            onSuccess: data => {
                // 데이터를 받아온 후 실행될 콜백
            }
        }
    );
    const { data: data2 } = useQueryWrap<resCategoryInfo, any, number>(
        ['fetch', 'test'],
        () => testCategory({ cd: 2007 }),
        {
            refetchOnWindowFocus: false,
            onSuccess: data => {
                // 데이터를 받아온 후 실행될 콜백
            },
            select: data => {
                return data?.list.length || 0;
            }
        }
    );
    const { data: cateData, isFetching, isLoading } = useQueryWrap(
        ['fetch', 'test'],
        () => testCategory({ cd: 2007 }),
        {
            refetchOnWindowFocus: false,
            onSuccess: data => {
                // 데이터를 받아온 후 실행될 콜백
            }
        }
    );
```

useQueryWrap에 제네릭 타입을 지정하고,  queryKey, axios query, option를 설정하여 데이터를 조회 합니다.

두번째 예시에 select를 사용하는 경우 data 타입을 변경이 되는 경우 3번째 제네릭에 타입을 셋팅하여 반환을 시켜야 합니다.

## useMutationWrap

```tsx
const { mutate: create, mutateAsync } = useMutationWrap(testCategory, {
        onSuccess: data => {
            console.log('⭐️ =>', data);
            // 데이터를 받아온 후 실행될 콜백
        }
    });

    useEffect(() => {
        create({ cd: 2007 });
        const call = async () => {
            const dataJun = await mutateAsync({ cd: 2007 });
            console.log('⭐️ Jun =>', dataJun);
        };
        call();
    }, []);
```

mutate를 호출 하여 셋팅한 axios를 통하여 데이터를 변경을 합니다.

mutateAsync는 Promise를 리턴 받게 되며, 셋팅한 axios를 통하여 데이터를 변경하고 그 결과에 대한 response 값을 리턴받아서 후 처리가 가능합니다.

즉 mutates는 호출하고 따로 후 처리가 없는 경우 주로 사용이 되며, 데이터 변경이 일어난 후 새로운 처리가 필요한 경우 mutateAsync를 사용하게 됩니다.

# 정리

React Query는 사용성에 있어서 많은 편의 기능을 제공하지만, 라이브러리의 설계 관점을 이해하고 적절한 패턴으로 사용하지 않으면 디버깅이 어려워지거나 컴포넌트 및 화면에 의존성이 많이 생겨 복잡성이 증가할 수 있습니다.

React Query는 데이터 요청과 관리를 간편하게 처리하기 위해 만들어진 라이브러리입니다. 내부적으로 캐싱, 자동 재요청, 에러 핸들링 등 다양한 기능을 제공하여 개발자가 비동기 데이터를 쉽게 다룰 수 있도록 도와줍니다. 이러한 기능들은 많은 편의성을 제공하지만, 동시에 라이브러리의 설계 관점을 이해하지 않고 사용하면 문제가 발생할 수 있습니다.

예를 들어, 적절한 캐싱 정책을 설정하지 않으면 중복된 요청이 발생하여 성능 저하를 유발할 수 있습니다. 또한, 데이터 의존성을 관리하지 않거나 잘못된 의존성을 설정하면 데이터가 갱신되지 않아서 오래된 데이터를 사용하는 문제가 발생할 수 있습니다.

또한, React Query를 사용하는 패턴에 따라서도 편의성과 복잡성이 달라질 수 있습니다. 최적의 패턴을 선택하지 않으면 컴포넌트 간에 의존성이 복잡해지고, 컴포넌트가 많은 데이터를 요청하거나 불필요하게 데이터를 다시 불러오는 경우가 발생할 수 있습니다.

따라서 React Query를 사용할 때는 라이브러리의 기능을 이해하고, 적절한 패턴과 옵션을 선택하여 사용하는 것이 중요합니다. 문서를 충분히 읽고, 예제를 참고하며, 라이브러리의 설계 원칙을 이해하는 것이 좋습니다. 이렇게 함으로써 React Query를 효과적으로 사용하여 개발 생산성을 높이고, 코드의 유지보수성을 높일 수 있습니다.


