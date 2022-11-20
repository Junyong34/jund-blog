---
title: "eslint를 통해 import order rule 셋팅 하기"
description: "eslint를 통해 import order rule 셋팅 하기"
date: 2022-11-20
update: 2022-11-20
tags:
  - eslint
  - import/order
  - webpack
  - vite
  - react
  - vite-react
series: "[ESLint] import/order"
---



## 시간이 지날수록 엉망이 되는 import 순서
react로 개발을 진행 하다보면 많은 Component, api, 라이브러리, copositions, react-query, 상태관리, router 등등 엄청나게 많은 파일을 import를 해서 조합 하거나 추가를 해서 개발을 진행하게 됩니다..

처음에는 import코드를 나름 규칙을 잡고 개발을 하게 되자만,  협합하는 사람들이 증가하거나,  서로 다른 IDE tool를 통해서 개발하다 보면 뒤죽박죽 import 순서가 추가되어 사용되어 지게 된다. 나는 나름 규칙을 잡고 import를 추가 했지만 다른사람 소스코드를 수정할 때 내가 생각하는 import 순서가 달라 디버깅하는데 뭔가 불편함을 느끼게 되었습니다. 그러다 eslint에서 import/order rules를 추가 하는 플러그인을 보고나서 적용하기로 했습니다.

## ESLint Plugin 설치
>해당 글은 vite 환경을 기준으로 설명합니다  (webpack도 비슷합니다..)

ESLint plugin 설치

#### 기본 설치
>  pnpm add -D eslint-plugin-import
> 
>  yarn add -D eslint-plugin-import
> 
>  npm i -D eslint-plugin-import

`eslint-plugin-import` 를 통해  import/export 구문을 설정을 합니다.

#### TypeScript Alis 사용시 설치
tsconfig에서 paths 설정을 했다면 아래 플러그인도 설치 해야합니다.

>  pnpm add -D eslint-import-resolver-typescript
> 
>  yarn add -D eslint-import-resolver-typescript
> 
>  npm i -D eslint-import-resolver-typescript

#### Webpack 환경
`webpack` 환경에서 resolver 셋팅 합니다.
>  pnpm add -D eslint-import-resolver-webpack
> 
>  yarn add -D eslint-import-resolver-webpack
> 
>  npm i -D eslint-import-resolver-webpack


#### Vite 환경
`vite` 환경에서 reslover 셋팅 합니다.
>  pnpm add -D eslint-import-resolver-vite
>  yarn add -D eslint-import-resolver-vite
>  npm i -D eslint-import-resolver-vite

## vite.config.ts 셋팅

```javascript
import { ConfigEnv, defineConfig, loadEnv } from 'vite'  
import react from '@vitejs/plugin-react'  
import tsconfigPaths from 'vite-tsconfig-paths'  
import eslint from 'vite-plugin-eslint'  
import svgr from 'vite-plugin-svgr'  
  
// https://vitejs.dev/config/  
export default defineConfig(({ mode }: ConfigEnv) => {  
  const env = loadEnv(mode, process.cwd())  
  
  return {  
    plugins: [react(), tsconfigPaths(), eslint(), svgr()],  

  }  
})
```
vite에서 typescript를 사용했다면 기본으로 `vite-tsconfig-paths` 가 셋팅 되어 있으며, 위에서 설치한
`vite-plugin-eslint` 셋팅 합니다.

## .eslintrc.json 셋팅
***완성본***
```json
{  
  "env": {  
    "browser": true,  
    "es2022": true  
  },  
  "extends": [  
    "eslint:recommended",  
    "plugin:react/recommended",  
    "plugin:@typescript-eslint/recommended",  
    "plugin:import/recommended",  
    "plugin:import/typescript"  
  ],  
  "parser": "@typescript-eslint/parser",  
  "parserOptions": {  
    "ecmaFeatures": {  
      "jsx": true  
    },  
    "sourceType": "module"  
  },  
  "plugins": ["react", "@typescript-eslint", "prettier","react-hooks"],  
  "rules": {  
    "import/order": [  
      "error",  
      {  
        "groups": [  
          [  
            "builtin",  
            "internal",  
            "external"  
          ],  
        ["sibling", "parent", "index"],  
        ["type","unknown"]  
    ],  
        "pathGroups": [  
          {  
            "pattern": "mui**",  
            "group": "internal",  
            "position": "before"  
          },  
          {  
            "pattern": "{react*,react*/**}",  
            "group": "external",  
            "position": "after"  
          },  
          {  
            "pattern": "@assets/**",  
            "group": "external",  
            "position": "after"  
          },  
          {  
            "pattern": "{@compositions/**,@components/**}",  
            "group": "internal",  
            "position": "before"  
          },  
  
          {  
            "pattern": "@config/**",  
            "group": "index",  
            "position": "before"  
          },  
          {  
            "pattern": "@hooks/**",  
            "group": "internal",  
            "position": "before"  
          },  
          {  
            "pattern": "@api/**",  
            "group": "internal",  
            "position": "before"  
          }
        ],  
        "pathGroupsExcludedImportTypes": ["{react*,react*/**}"],
        "alphabetize": {  
          "order": "desc",  
          "caseInsensitive": true  
        },  
        "newlines-between": "always"  
      }  
    ],  
    "react/react-in-jsx-scope": "off",  
    "react-hooks/rules-of-hooks": "error", 
    "react-hooks/exhaustive-deps": "warn"
  },  
  "overrides": [  
    {  
      "files": ["*.ts", "*.tsx"],  
      "rules": {  
        "@typescript-eslint/explicit-module-boundary-types": ["off"],  
        "@typescript-eslint/no-explicit-any": ["off"]  
      }  
    }  
  ],  
  "settings": {  
    "import/resolver":  {  
      "typescript": {}
    }
  }  
}

```

위 .eslintrc.json 설정이 완료된 코드 입니다.

뭐가 추가 되었는지 한번 학인 해봅시다.


- settings에 import/resolver를 추가 해줍니다.
    - `typescript` 를 작성해야 tsconfig 파일을 읽어서 alias 설정도 가능 합니다.
-  extends에 설치된 2개 플러그인을 추가 합니다.
    - `plugin:import/recommended`,  `plugin:import/typescript`
- rules에 `import/order` 를 추가 합니다.
    -  `"error"` 를 추가하여 규칙에 위반이 되면 eslint error를 표시 합니다.
    - `groups` 설정에 대한 상세한 정보는 해당 [URL](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md)를 참고 하세요
        -  ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"] 8가지 그룹을 제공합니다.
        - 각각 그룹은 배열로 한번 더 감싸서 그룹을 묶는것도 가능합니다.
            -   ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"] 8개 각각 그룹
            - [  [ "builtin",   "internal",   "external" ], ["sibling", "parent", "index"],          ["type","unknown"] ]  3개 그룹
        - 설정한 그룹 순서로 import가 정렬 됩니다. 순서를 변경하면서 테스트 해보면 알 수 있습니다.

- groups를 추가 했으니, 어떤 path를 해당 그룹에 넣을지 pathGroups 설정을 통해 지정 합니다.
- `pathGroups`
    -  `pattern` 패턴을 지정합니다.
        -  tsconfig에서 alias를 지정 했다면, alias를 적어도 plugin를 설치 했기 떄문에 적용이 됩니다.
        -  @component/** 을 지정하면 import 구문에 from path가 @component 시작되는 패턴으로 인식 합니다.
        - {react*,react*/**}을 지정하면 import 구문에 from path가 react로 시작되는 패턴으로 인식 합니다.
    - `group` 은 위 8가지 그룹중 하나를 설정 합니다. 그룹을 설정하게 되면 pattern이 그룹에 속하게 됩니다.
    - `position`  before / after 2가지 값으로 설정이 가능합니다.
        - 패턴별로 겹치는 그룹에 대한 위치는 해당 설정으로 order 변경이 가능합니다.
```json
"pathGroups": [  
          {  
            "pattern": "mui**",  
            "group": "internal",  
            "position": "before"  
          },  
          {  
            "pattern": "{react*,react*/**}",  
            "group": "external",  
            "position": "after"  
          },  
          {  
            "pattern": "@assets/**",  
            "group": "external",  
            "position": "after"  
          },  
          {  
            "pattern": "{@compositions/**,@components/**}",  
            "group": "internal",  
            "position": "before"  
          },  
  
          {  
            "pattern": "@config/**",  
            "group": "index",  
            "position": "before"  
          },  
          {  
            "pattern": "@hooks/**",  
            "group": "internal",  
            "position": "before"  
          },  
          {  
            "pattern": "@api/**",  
            "group": "internal",  
            "position": "before"  
          },  
        ],  
```

- `pathGroupsExcludedImportTypes` 는 pathGroups에 설정한 순서가 적용이 되지 않을 떄 사용하면 의도와 맞도록 셋팅 해주게 됩니다. 내가 설정한 그룹과 다르게 order가 된다면 값을 셋팅 해보면서 설정을 하면 됩니다.
- `newlines-between`은 group 사이에 한칸 띄워지도록 도와줍니다. (위에 셋팅은 크게 3개 그룹으로 셋팅을 했으니 그룹별 최대 3개 줄바꿈이 발생합니다.)
    -   `ignore`  규칙을 무시합니다.
    -   `always` group 마다 줄바꿈이 적용 됩니다,
    -   `always-and-inside-groups` group 마다 띄어쓰기 적용 하며,  group 안에 내부끼리  줄바꿈이 됩니다.
    -  ` never`  group사이 줄바꿈이 적용 되지 않습니다.
- `alphabetize`  group 안에서 정렬 및 대소문자 순서를 지정할 수 있습니다.
    - `order` 는 오름차순(ASC), 내림차순(DESC), ignore  3가지 설정 가능 합니다.
    - `caseInsensitive` true 값은 대문자 우선 정렬, false 값은 소문자 우선 정렬

## import/order 결과물

before
```javascript
import { SubHeader } from '@compositions/Header'  
import Page from '@src/components/Page'  
import { FormProvider, useForm } from 'react-hook-form'  
import React, { useEffect } from 'react'  
import BasicInfo from './InputData/BasicInfo'  
import { Divider } from '@mui/material'  
import Button from '@components/Button'  
import useConfirmDialog, { useConfirmDialogProps } from '@components/Dialog/hooks/useConfirmDialog'  
import { useMutation } from '@queries/useMutation'  
import SnackbarService from '@services/SnackbarService'  
import { To } from '@routes/To'  
import { useNavigate, useParams } from 'react-router-dom'  
import { queryClient } from '@queries/client'    
import { UserDto } from '@api/model/user'
```

after
```javascript
import { useNavigate, useParams } from 'react-router-dom'  
import { FormProvider, useForm } from 'react-hook-form'  
import  { useEffect } from 'react'  
import { UserDto } from '@api/model/user'
  
import { useMutation } from '@queries/useMutation'  
import { queryClient } from '@queries/client'  
  
import { SubHeader } from '@compositions/Header'  
import useConfirmDialog, { useConfirmDialogProps } from '@components/Dialog/hooks/useConfirmDialog'  
import Button from '@components/Button'  
  
import Page from '@src/components/Page'  
import SnackbarService from '@services/SnackbarService'  
import { To } from '@routes/To'  
import { Divider } from '@mui/material'  
  
import BasicInfo from './InputData/BasicInfo'

```

ESLint import/order를 통해 import 순서를 강제화를 하니 한결 보기 편해졌고, 내가 원하는 import를 찾는게 더 좋아졌습니다. 또 여러명과 협업하게 되어도 import rules에 따라서 자동 정렬이 되어버리니 걱정이 없습니다.😄
### 참조
- https://github.com/import-js/eslint-plugin-import
- https://github.com/import-js/eslint-import-resolver-typescript
- https://github.com/pzmosquito/eslint-import-resolver-vite
