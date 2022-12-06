---
title: "typescript infer 언제 사용할까?"
description: "infer 문법 공부하기"
date: 2022-12-10
update: 2022-12-10
tags:
  - typescript
  - infer
  - ts
series: "typescript Cook Book
---

## TypeScript Infer

유틸로 제공되는 타입(pick,Parameters,Extract,Omit,Exclude,Record, ...etc) 타입을 보는 중에
Parameters 타입을 보다보니 infer라는 문법이 눈에 띄었습니다.

```typescript
type Parameters<T extends (...args: any) => any> = T extends
(...args: infer P) => any ? P : never;
```

어떤식으로 작동을 하는지 궁금했습니다.

`infer`는 조건부 타입에서 true로 평가 될때 사용이 되며, 타입을 새로 저장하여 타입을 추출 합니다.

즉 'infer' 키워드는 조건부 타입에서 사용가능 합니다.
```typescript
T extends infer U ? U : Y
```
extends `조건부타입`에서 infer를 사용합니다.


## infer 알고 쓰자

**간단한 예제1**
```typescript
type Sample<T> = T extends  infer R ? R : undefined;
const a1 :Sample<number> = 1;
// a1의 타입은 number;
const a2: Sample<()=>void> = () => console.log(1);
// a2의 타입은 ()=>void
```
>T extends  infer R ? R : undefined;

T 가 infer R 이면 R 이고 아니면 undefined 타입을 반환 됩니다.

`Sample<number>` T가 number 이고 infer가 추론한 타입 R도 number 이다. true 조건이 성립되어
 추론한 R 타입도 number가 반환됩니다.

`Sample<()=>void>` T가 ()=>void 타입이고 infer가 추론한 타입 R도 ()=>void 이다. true 조건이 성립되어
추론한 R 타입도 ()=>void가 반환됩니다.

**간단한 예제2**

```typescript
type Sample2<T> = T extends  (infer R)[] ? R : undefined;
const a3: Sample2<number> = undefined;
const a4: Sample2<number[]> = 1;
```
`Sample2<number>` T가 inter 타입에 배열이면 추론한 타입 R이 되고 아니면 undefined가 반환 합니다.
즉. T는 number이고 (inter R)[]이 아니라서 undefined가 반환 됩니다.

`Sample2<number[]>` T가 number[] 이고, infer R은 number가 추론 되며, 즉 number[]가 되어 true
조건이 성립되어 infer에서 추론한 R타입인 number가 반환 됩니다.

## infer 에러 발생 case

infer 타입은 위에서조건부 타입에서 true로 평가 될때 사용이 되며, 타입을 새로 저장하여 타입을 추출 한다고 했습니다.
만약 다른 방식으로 사용되는 케이스는 에러가 발생합니다.

```typescript
type inferError<T extends (infer U)[]> = T[0] 
// 조건부 타입에서 true로 평가 될때 사용하지 않아서 에러가 발생 합니다.
type inferError<T> = (infer U)[] extends T ? U : T 
// 조건부 타입에서 사용하지 않아 에러가 발생 합니다.
type inferError<T> = T extends (infer U)[] ? T : U
// 조건부 타입에서 사용했지만, false로 평가 될때 U를 추론하였기 때문에 에러가 발생 합니다.
```

## infer를 사용하여 객체 key 타입 추론하기
조건부 타입과 infer를 사용하여 객체 key 타입을 추론해서 가져올 수 있습니다.

```typescript
type Car = {
  carNumber: number;
  carName: string;
}

type carArrayTyep<T> =  T extends { carNumber: infer U, carName: infer R } ? [U, R] : T
type C3 = carArrayTyep<Car> // [number, string]
```

carNumber에 infer U 타입을 추론하고, carName에 infer R 타입을 추론해서 true 평가 되면 추론한 타입 [U, R]을 반환
하게 됩니다.
`C3` 타입은 `[number, string]`가 됩니다.


```typescript
type Car = {
 carNumber: number;
 carName: string;
}

type carArrayTyep<T> =  T extends { carNumber: infer U, carName: infer U} ? U : T
type C3 = carArrayTyep<Car>
```
서로 다른 객체 키에 대한 타입을 하나의 infer U 타입으로 추론을 하게 되면 `string | number` union 타입을
반환하게 됩니다. 이유는 `공변(covariant)` 같은 위치에 여러개 타입이 존재하는 경우 최종 타입이 union으로 타입이
추론 됩니다.


>타입스크립트에서는 공변성을 갖고 있지만, 함수의 매개변수는 반공변을 갖고 있습니다

```typescript
type Food<T> = T extends { name: (x: infer U) => void, cook: (x: infer U) => void } ? U : never;

type F = Food<{ name: (x: string) => void, cook: (x: number) => void }>;  
```

이번에는 `반공변(contravariant)`에 대하여 확인 해보겠습니다.
반공변은 같은 위치에 여러개 타입이 존재하는 경우 교차(intersection) 타입이 추론 됩니다 
즉 위에 예시 `F`에 대한 타입은 `string & number` 타입이 추론 됩니다.

`공변(covariant)` , `반공변(contravariant)`에 대하여 알아봅시다.

고차 타입 X은 Array<T> 타입 같이 복잡한 타입을 반환하는 타입을 `고차 타입`이라고 한다.

`공변`은 임의 고차타입 X에 대하여 A => B일 때 X< A > => X< B > 이면 X는 공변 타입이다.

`반공변`은 임의 고차타입 X에 대하여 A => B일 떄 X< B > => X< A > 이면 X는 반공변 타입이다.

- 타입을 번환하는 함수 타입은 공변한다.
```typescript
type C<T> = (arr: string[]) => T
```
- 함수가 아닌 타입은 공변한다.
```typescript
type C1<T> = T & { id: number }
```
- 제네릭 타입을 매개변수로 사용하는 함수타입은 반공변 한다.
```typescript
type C2<T> = (v: T) => number
```

```typescript
type Food<T> = T extends { name: (x: infer U) => void, cook: (x: infer U) => void } ? U : never;
type F = Food<{ name: (x: string) => void, cook: (x: number) => void }>;  
```
위에서 작상한 에시는 `반공변`하기 떄문에 `string & number' 타입이 추론 되었지만 
공변하도록 변경을 하게 되면 아래와 같습니다.

```typescript
type Food<T> = T extends { name: (x: string) => infer U, cook: (x:number) => infer U } ? U : never;
type F = Food<{ name: (x: string) => string, cook: (x: number) => number }>;  
```
함수의 반환 타입을 infer U로 추론하고 있어 `공변`합니다. 즉 F타입은 `string | number`가 반환 됩니다.

공변, 반공변에 대한 좀 더 자세한 글은 여기 [링크](https://www.zerocho.com/category/TypeScript/post/5faa8c657753bd00048a27d8)
에서 확인 해주세요


## 결론  
```typescript
type Parameters<T extends (...args: any) => any> = T extends
(...args: infer P) => any ? P : never;
```
Parameters 타입에서 시작 되었으니, 타입에 대하여 풀어보면
`T` 가 조건부 타입 `(...args: infer P) => any` 이면 true가 성립이 되면 `...args` 타입 infer P를 추론하여
`P` 타입을 반환하고 아니면 `never`를 반환 합니다.

```typescript
const abSum = (a:number,b:number) => {
  return a + b;
}
type paramSumTS = Parameters<typeof abSum>;
```
`...args`는(arguments Array 객체이며)  a, b는 [a,b]가 되고 `a` 타입은 number , `b` 타입도 number 
즉 `infer P `에 P 타입을 추론하면 `[a: number, b: number]` 타입이 반환 됩니다. paramSumTS 타입은 `[a: number, b: number]` 됩니다.



 
### 참조
- https://levelup.gitconnected.com/using-typescript-infer-like-a-pro-f30ab8ab41c7
