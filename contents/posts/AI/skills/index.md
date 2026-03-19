---
title: "Claude Skill v2 정리: 공식 문서 핵심과 실전 스킬 제작기"
description: "Agent Skills 공식 문서 핵심, 참조 링크, 그리고 front-end-code-guidelines 스킬을 직접 설계·검증한 과정을 정리한 글"
date: 2026-03-19
update: 2026-03-19
tags:
  - ai
  - claude
  - skills
  - skill-v2
  - codex
series: "AI 활용법"
ogImage: "./og-image.webp"
---

프롬프트를 길게 잘 적는 것만으로는 AI가 안정적으로 같은 품질을 반복하지 못하는 경우가 많습니다. 대화가 길어질수록 맥락이 흔들리고, 프로젝트 규칙을 매번 다시 설명해야 하며, 한 번 잘 되던 답변이 다음 작업에서는 재현되지 않기도 합니다.

그래서 저는 "AI를 잘 쓰는 법"보다 "AI가 잘 일하도록 운영 환경을 만드는 법"에 관심을 가지게 됐습니다. 그 과정에서 가장 실용적이었던 도구가 바로 Skill이었습니다. 공식 문서 기준 현재 명칭은 `Agent Skills`이지만, 초기에는 skill v1으로 불렸습니다.

v1에서는 AI가 스킬을 일관성 있게 활용하지 못하는 문제가 있었습니다. 같은 작업에서도 스킬을 적용할 때가 있고 그렇지 않을 때가 있어서, 명시적 할당이나 hook 같은 우회 방법을 자주 사용해야 했습니다. 최근 공개된 `Agent Skills v2`는 완전히 새로운 구조는 아니지만, 새로운 스킬 타입과 함께 기존과 다른 방식으로 동작하는 `hooks` 개념이 추가되었습니다.

Anthropic은 2025년 10월 16일 Agent Skills를 공개했고, 2025년 12월 18일에는 cross-platform portability를 위한 open standard 공개 소식을 추가로 안내했습니다. 이번 글에서는 공식 문서에서 확인한 핵심 개념과 함께, 제가 직접 만든 `front-end-code-guidelines` 스킬을 어떤 방식으로 설계하고 정리했는지 소개하겠습니다.

이 글은 이전에 정리한 [AI를 협업 파트너로 만드는 4단계](/practical/)에서 설명한 "skill 기반 운영"의 실제 예시이기도 합니다.

## Agent Skills는 무엇이 달라졌을까

공식 설명 기준으로 Agent Skills는 에이전트가 특정 작업을 더 잘 수행하도록 돕는 "폴더 단위의 재사용 가능한 전문 지식 패키지"에 가깝습니다. 핵심은 단순 프롬프트 저장이 아니라, `SKILL.md`를 중심으로 설명, 참조 문서, 스크립트, 평가 시나리오를 함께 묶어 운용할 수 있다는 점입니다.

제가 중요하게 본 지점은 3가지입니다.

1. 매번 같은 설명을 프롬프트에 반복하지 않아도 됩니다.
2. 필요한 시점에만 관련 문서를 읽는 구조를 만들 수 있습니다.
3. 평가 시나리오를 함께 두면 "잘 작동하는지"를 점검하는 기준이 생깁니다.

특히 공식 문서와 엔지니어링 글에서 공통으로 강조하는 개념이 `progressive disclosure`입니다. 시작 시점에는 모든 Skill의 `name`과 `description`만 먼저 읽고, 현재 작업과 관련성이 생겼을 때만 `SKILL.md` 본문을 추가로 읽습니다. 그 다음에도 필요할 때만 `references/` 같은 추가 파일을 읽도록 설계할 수 있습니다.

이 구조 덕분에 Skill은 문서를 한꺼번에 밀어 넣는 방식보다 훨씬 효율적입니다. 필요한 맥락만 순차적으로 불러오기 때문에 토큰 낭비를 줄이면서도, 작업 정확도는 높일 수 있습니다.

## SKILL.md 중심 구조를 이해하기

Skill의 중심은 결국 `SKILL.md`입니다. 공식 예시와 제 사용 경험을 같이 놓고 보면 최소 구조는 아래처럼 이해하면 됩니다.

```text
my-skill/
├── SKILL.md
├── references/
│   ├── react.md
│   ├── typescript.md
│   └── development.md
└── evals/
    └── evals.json
```

여기서 중요한 포인트는 모든 것을 `SKILL.md` 하나에 몰아넣지 않는 것입니다. 자주 필요한 핵심 규칙은 `SKILL.md`에 두고, 세부 가이드나 긴 예시는 `references/`로 분리하는 편이 좋습니다. Anthropic이 설명하는 progressive disclosure도 결국 이 분리 구조를 잘 설계하라는 뜻으로 읽었습니다.

또 하나 중요한 것은 `description`입니다. 공식 문서에서는 `description`이 Skill discovery를 좌우한다고 설명하고, 무엇을 하는 Skill인지와 언제 써야 하는지를 함께 적으라고 권장합니다. 저는 이 부분이 실제 체감상 가장 중요했습니다. Skill을 만들어도 description이 모호하면 잘 불리지 않았고, 반대로 적용 범위와 비적용 범위를 분명히 적으면 트리거 정확도가 훨씬 좋아졌습니다.

## 공식 참고 링크

아래 링크들은 이번 글을 정리하면서 직접 참고한 1차 자료입니다.

- [Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview): Agent Skills의 개념과 기본 구조를 설명하는 공식 개요 문서입니다.
- [Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices): `description`, 구조화, 간결성, 평가 우선 흐름을 정리한 공식 작성 가이드입니다.
- [Claude Code skills docs](https://code.claude.com/docs/en/skills): Claude Code에서 Skill을 어디에 두고 어떻게 확장하는지 설명하는 문서입니다.
- [anthropics/skills](https://github.com/anthropics/skills): Anthropic이 공개한 예시 Skill 저장소로, 실제 구조를 확인하기 좋습니다.
- [Equipping agents for the real world with Agent Skills](https://claude.com/blog/equipping-agents-for-the-real-world-with-agent-skills): progressive disclosure와 Skill anatomy를 이해하기 좋은 엔지니어링 글입니다.

## 왜 프로젝트 전용 프론트엔드 Skill을 만들었을까

제가 실제로 만든 Skill은 `skills/front-end-code-guidelines/SKILL.md`입니다. 이 Skill은 일반적인 React 팁 모음이 아니라, 제가 일하는 프론트엔드 프로젝트에서 반복적으로 설명하던 기준을 묶고, 팀원간에 AI활용한
코딩에서 나오는 ouput을 어느정도 일관적으로 맞추기 위한 스킬 작업 이였습니다. 또 매번 라이브러리 버전을 명시하는 부분도 자동으로 처리할 수 있도록 했습니다.

필요했던 이유는 분명했습니다.

1. React, TypeScript, Emotion, 상태 관리 기준을 매번 다시 설명해야 했습니다.
2. 레거시 코드가 섞여 있어 "이상적인 구조"보다 "이 프로젝트에서 안전한 기본값"이 중요했습니다.
3. 리뷰 기준이 사람마다 흔들리면 AI도 같은 작업에서 다른 결론을 내리기 쉬웠습니다.

처음에는 큰 rules 문서 하나로 운영하려고 했지만 비효율적이었습니다. 모든 작업에서 긴 문서를 통째로 읽게 만들면 토큰도 많이 쓰고, 정작 필요한 규칙은 묻히기 쉬웠습니다. 그래서 범용 rules 대신, 작업 맥락에 따라 자동으로 연결되기 쉬운 Skill 구조로 분리했습니다.

## 제가 만든 Skill 구조

제가 만든 전체 스킬 구조와 내용은 [AI-PlayBook 저장소](https://github.com/Junyong34/AI-PlayBook)에서 확인할 수 있습니다. 현재 이 저장소 안의 실제 구조는 아래와 같습니다.

```text
skills/front-end-code-guidelines/
├── SKILL.md
├── evals/
│   └── evals.json
└── references/
    ├── development.md
    ├── react.md
    ├── style-emotion-css.md
    └── typescript.md
```

핵심 파일인 `SKILL.md`에는 Skill의 적용 범위와 기본 원칙만 두었습니다. 예를 들어 React 컴포넌트, 상태 관리, Hook 문제, Emotion 스타일링, TypeScript 타입 설계처럼 이 Skill이 개입해야 할 상황을 `description`에 구체적으로 적었습니다. 반대로 `Next.js`, `React Native`, `Vue`, 인프라 작업처럼 적용하지 않을 범위도 함께 적었습니다.

제가 실제로 사용한 frontmatter 일부는 아래와 같습니다.

```md
---
name: front-end-code-guidelines
description: |
  프론트엔드 코드 가이드라인을 적용합니다.

  Use this skill whenever the user is writing, modifying, debugging, or reviewing React/TypeScript web frontend code.
  Does NOT apply to: Next.js, React Native, Vue, infra, or non-React-web projects.
---
```

이 구조를 택한 이유는 단순합니다. `description`에서 적용 조건을 최대한 명확하게 써야 Agent가 "언제 이 Skill을 읽어야 하는지"를 더 잘 판단하기 때문입니다. 공식 문서도 description에는 "무엇을 하는지"와 "언제 쓰는지"를 같이 넣으라고 권장합니다.

## references를 어떻게 나눴는가

`SKILL.md` 하나에 모든 내용을 넣지 않고 `references/`로 나눈 것도 의도적인 설계였습니다.

- `react.md`: 상태 위치 판단, Hook 사용, 안티패턴처럼 자주 헷갈리는 React 기준을 정리했습니다.
- `typescript.md`: 반환 타입 명시, `unknown`에서 시작하는 경계 처리, `any/as` 최소화 같은 타입 설계 기준을 담았습니다.
- `style-emotion-css.md`: `styled`와 `css prop`의 역할 분리처럼 스타일링 판단 기준을 정리했습니다.
- `development.md`: 최소 변경 원칙, 작업 범위 판단, 리뷰 코멘트 형식 같은 개발 방법론을 담았습니다.

각 문서에는 프로젝트의 레거시 코드 특성, 사용 중인 라이브러리 버전, 환경별 제약사항 같은 프로젝트 고유의 컨텍스트도 함께 명시했습니다. 이렇게 나누면 Agent가 현재 작업과 관련된 문서만 골라 읽을 수 있습니다. 예를 들어 상태 관리 질문에서는 React 기준이 먼저 필요하고, 스타일링 질문에서는 Emotion 가이드가 더 중요합니다. 모든 것을 한 문서에 밀어 넣는 것보다 훨씬 실용적입니다.

## evals는 어떻게 붙였는가

공식 문서와 엔지니어링 글에서 공통으로 보인 조언은 "먼저 평가할 작업을 생각하라"는 점이었습니다. 그래서 저도 구현보다 먼저, 이 Skill이 실제로 어떤 질문에 일관된 대답을 해야 하는지부터 정리했습니다.

`skills/front-end-code-guidelines/evals/evals.json`에는 현재 6개의 평가 시나리오가 있습니다. 성격은 아래처럼 나뉩니다.

1. DTO와 화면 모델을 분리해야 하는가
2. React Query 데이터를 Redux에 복사해도 되는가
3. 커스텀 훅의 반환 타입을 명시해야 하는가
4. `styled`와 `css prop`은 어떻게 나눌 것인가
5. 파생 상태를 `useEffect + setState`로 둘 것인가
6. 레거시 코드에서 최소 변경 원칙을 어떻게 지킬 것인가

실제 예시 하나만 보면 아래와 같습니다.

```json
{
  "id": 2,
  "prompt": "React Query로 배너 데이터를 가져오는데, 첫 로딩이 끝나면 그 데이터를 Redux에 저장해서 다른 화면에서도 쓰려고 합니다. useEffect로 data가 바뀔 때마다 dispatch(setBanner(data))를 호출하고 있어요. 이 패턴이 맞나요?",
  "expected_output": "서버 상태를 Redux에 복사하는 것은 AVOID 패턴이라고 지적합니다. React Query는 이미 캐싱과 동기화를 제공하므로 다른 화면에서도 같은 queryKey로 useQuery를 호출하면 된다고 설명합니다."
}
```

이런 평가 시나리오를 두면 Skill이 단순 설명 문서에서 끝나지 않고, "이 Skill이 어떤 판단을 반복해서 재현해야 하는가"를 점검하는 기준으로 바뀝니다.

## 제가 실제로 사용한 제작 워크플로우

이 Skill은 제가 직접 만든 프로젝트 전용 가이드라인을 바탕으로 만들었습니다. 작업 흐름은 대략 아래 순서였습니다.

1. 프론트엔드 작업에서 반복적으로 설명하던 판단 기준을 먼저 글로 정리했습니다.
2. `skill-creator`를 사용해 Skill을 생성했습니다. `skill-creator`는 입력한 가이드라인을 바탕으로 `SKILL.md + references + evals` 구조를 자동으로 구성하고, evals 검증까지 수행해 줍니다.
3. 생성된 Skill의 `description`과 평가 시나리오를 프로젝트 특성에 맞게 보완하고, `skill-creator`가 `description` 최적화 작업도 진행해줬습니다.
4. 실제로 자주 나오는 질문을 기준으로 `expected_output`을 구체화했습니다.

여기서 중요한 점은 "좋은 문장을 쓰는 것"보다 "재현 가능한 판단 기준을 만드는 것"이었습니다. 같은 질문이 들어왔을 때 비슷한 원칙으로 답해야 Skill의 가치가 생깁니다.

## 이 Skill을 만들고 나서 달라진 점

앤드로픽에서 만든 `skill-creator` 스킬이 스킬 만들면서 최적화 진행 및 테스트 결과에 대한 피드백도 해줘서 내가 만든 스킬 발동이 더욱 정확해졌습니다.

첫째, 프롬프트 반복 입력이 줄었습니다. 예전에는 "React Query 데이터는 Redux에 복사하지 말 것", "`useEffect`는 외부 시스템 동기화에만 쓸 것", "작업은 최소 변경 원칙으로 갈 것" 같은 설명을 매번 다시 써야 했습니다. 지금은 Skill이 해당 맥락을 먼저 끌어오는 구조를 만들 수 있습니다.

둘째, 프로젝트 맥락을 더 안정적으로 고정할 수 있었습니다. 범용 모델은 React를 잘 알더라도, 우리 프로젝트의 상태 관리 기준이나 레거시 대응 원칙까지 자동으로 아는 것은 아닙니다. Skill은 이 간극을 메우는 데 유용했습니다.

셋째, 리뷰 기준이 일관되어졌습니다. 단순히 "코드를 예쁘게"가 아니라, 왜 이 패턴을 피해야 하는지와 어떤 최소 수정이 적절한지를 문서로 고정할 수 있었습니다.

넷째, 레거시 프론트엔드에서 자주 흔들리던 의사결정 기준이 명확해졌습니다. 이상적인 구조를 무조건 강요하는 대신, "현재 요청과 직접 연결된 최소 변경"이라는 기본값을 고정한 점이 특히 실용적이었습니다.

## 마무리

저는 AI를 페어 프로그래밍하는 동료라고 생각합니다. 동료가 프로젝트에 합류했을 때 프로젝트 히스토리, 기술 스택, 코딩 컨벤션, 주의사항을 공유하듯이, AI도 같은 정보를 알고 있어야 같은 기준점에서 코드를 작성할 수 있습니다. 제가 만든 `front-end-code-guidelines` Skill은 이런 관점에서 AI에게 주는 온보딩 문서입니다. 범용 프론트엔드 가이드가 아니라 현재 프로젝트 환경에 특화된 스킬이며, 팀원들이 함께 업데이트하며 살아있는 문서로 키워가고 있습니다.

Claude Skill v2의 핵심은 AI를 단발성 채팅 도구가 아니라 재사용 가능한 작업이라고 생각합니다.
필요한 맥락만 점진적으로 불러오고, `description`으로 발견 가능성을 높이고, 평가 시나리오로 품질 기준을 세우는 방식입니다. 결론적으로 Agent Skills는 AI 활용 팁이 아니라, AI가 같은 기준으로 반복 작업하게 만드는 운영 도구입니다.

> AI가 더 발전하고 똑똑해진다면 해당 스킬도 레거시가 될 것 같긴합니다.
