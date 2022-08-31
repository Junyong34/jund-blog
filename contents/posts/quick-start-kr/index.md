---
title: "🚀 오픈"
description:
date: 2022-08-31
update: 2022-08-31
tags:
  - start
series: "기술블로그"
---


## 1.gatsby-starter-hoodie theme 사용하여 블로그 생성

```
$ npx gatsby new my-hoodie-blog https://github.com/devHudi/gatsby-starter-hoodie
```

### 프로젝트 구조

아래 프로젝트 구조를 참고하여 커스터마이징 할 수 있습니다 🙊.

```
├── node_modules
├── contents
│   └── posts // your articles are here
├── public // build outputs are here
└── src
    ├── assets
    │   └── theme // theme config is here
    ├── components
    │   └── Article
    │       └── Body
    │           └── StyledMarkdown
    │               └── index.jsx // markdown styles are here
    │   ...
    ├── fonts // webfonts are here
    ├── hooks
    ├── images
    ├── pages // page components are here
    ├── reducers
    ├── templates // post components are here
    └── utils
```
