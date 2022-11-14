---
title: "storybook 짝궁 chromatic 조합"
description: "storybook 짝궁 chromatic 조합"
date: 2022-11-14
update: 2022-11-14
tags:
  - storybook
  - stories
  - chromatic
  - test
  - vite
  - react
  - vite-react
series: "React로 Storybook 구성하기"
---

## chromatic 이란?
>크로메틱 공식 홈페이지([chromatic](https://www.chromatic.com/))에 많은 기능과 내용이 있습니다.

스토리북으로 컴포넌트를 관리하고 테스트를 넣었다면, 크로메틱으로 시각화 테스트 및 협업 도구로 사용하기 좋습니다.
#### 내가 사용한 기능
1. 디자이너, 기획자, 등등 다른 사람과 헙업시 chromatic 도메인에 초대를 해서 컴포넌트 별로 코멘트를 작성이 가능하며, 공유가 가능합니다. 
2. github gitAction CI/CD에 크로메틱을 연동하여 PR Merge 하기전에 내가 스타일 수정을 하면서 변경된 사항들을 git CheckList를 통해서 검증이 가능합니다.
3. 컴포넌트 위치 및 스타일이 변경된 부분을 시각화하여 보여주기 때문에 배포하기 이전에 내가 수정한 부분이 어떤 컴포넌트,페이지 등등에 영향이 가는지 확인이 가능합니다.

.. 끄적끄적 중

### chromatic 환경 구성하기 (cli)

### chromatic Page 살펴보기

### chromatic 변경점 시각화

### gitAction chromatic 연동 하기 (CI/CD)

### chromatic 알람 Slack 채널 webhooks을 통해 전달 받기(번외)


### 참조
- https://www.chromatic.com
- https://github.com/chromaui/chromatic-cli
- https://github.com/marketplace/actions/publish-to-chromatic
- https://www.chromatic.com/docs/test
