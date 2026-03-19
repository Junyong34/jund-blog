#!/bin/bash

# ======================================
# WebP 이미지 변환 스크립트
# ======================================
# PNG, JPG, JPEG 파일을 WebP 형식으로 일괄 변환
#
# [사전 준비]
# 이 스크립트를 실행하기 전에 webp 패키지가 설치되어 있어야 합니다:
#   brew install webp
#
# [실행 방법]
# 1. 기본 디렉토리(../public) 사용:
#    ./convert-to-webp.sh
#
# 2. 특정 디렉토리 지정:
#    ./convert-to-webp.sh /path/to/images
#
# 3. 현재 디렉토리 사용:
#    ./convert-to-webp.sh .
#
# 4. 상대 경로 사용:
#    ./convert-to-webp.sh ../src/assets
# ======================================

# 스크립트 실행 시 에러 발생하면 즉시 중단
set -e

# ======================================
# 대상 디렉토리 설정
# ======================================
# 첫 번째 인자로 디렉토리 경로를 받음
# 인자가 없으면 기본값 ../public 사용
TARGET_DIR="${1:-../public/og-images/post}"

# ======================================
# cwebp 설치 확인
# ======================================
# cwebp 명령어가 시스템에 설치되어 있는지 확인
if ! command -v cwebp &> /dev/null; then
  echo "cwebp가 설치되어 있지 않습니다."
  echo "   다음 명령어로 설치해주세요: brew install webp"
  exit 1
fi

# ======================================
# 대상 디렉토리 존재 여부 확인
# ======================================
# 지정된 디렉토리가 실제로 존재하는지 검증
if [ ! -d "$TARGET_DIR" ]; then
  echo "대상 디렉토리가 존재하지 않습니다: $TARGET_DIR"
  exit 1
fi

# ======================================
# WebP 압축 품질 설정
# ======================================
# 사용자로부터 압축 품질 입력 받기 (기본값: 90)
read -p "WebP 압축 품질을 입력하세요 (1-100, 기본값: 90): " QUALITY
QUALITY=${QUALITY:-90}

# 입력값이 1~100 사이의 숫자인지 검증
if ! [[ "$QUALITY" =~ ^[0-9]+$ ]] || [ "$QUALITY" -lt 1 ] || [ "$QUALITY" -gt 100 ]; then
  echo "유효하지 않은 값입니다. 1~100 사이의 숫자를 입력해주세요."
  exit 1
fi

# ======================================
# 변환 작업 시작 정보 출력
# ======================================
echo ""
echo "대상 디렉토리: $TARGET_DIR"
echo "압축 품질: $QUALITY"
echo "-------------------------------------------"

# 변환 통계를 위한 카운터 초기화
CONVERTED=0  # 성공적으로 변환된 파일 수
SKIPPED=0    # 이미 webp 파일이 존재하여 건너뛴 파일 수
FAILED=0     # 변환 실패한 파일 수

# ======================================
# 이미지 파일 찾기 및 변환 처리
# ======================================
# TARGET_DIR 하위의 모든 PNG, JPG, JPEG 파일을 찾아서 처리
# find: -type f (파일만), -iname (대소문자 구분 없이 이름 매칭), -print0 (null로 구분)
while IFS= read -r -d '' file; do
  # 파일의 디렉토리 경로와 이름 추출
  dir=$(dirname "$file")
  filename=$(basename "$file")
  name="${filename%.*}"  # 확장자를 제외한 파일명
  output="$dir/$name.webp"  # 출력 파일 경로

  # 이미 webp 파일이 존재하는지 확인
  if [ -f "$output" ]; then
    echo "스킵 (이미 존재): $output"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi

  echo -n "변환 중: $file → $output ... "

  # cwebp를 사용하여 이미지 변환 시도
  # -q: 품질 설정, -o: 출력 파일, -quiet: 변환 과정 메시지 숨김
  if cwebp -q "$QUALITY" "$file" -o "$output" -quiet 2>/dev/null; then
    # 원본 파일과 변환된 파일의 크기 비교
    # macOS(stat -f%z) 또는 Linux(stat -c%s) 명령어 사용
    ORIG_SIZE=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    NEW_SIZE=$(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null)
    # 압축률 계산 (원본 대비 백분율)
    RATIO=$(echo "scale=1; $NEW_SIZE * 100 / $ORIG_SIZE" | bc 2>/dev/null || echo "?")
    echo "완료 (${RATIO}% of original)"
    CONVERTED=$((CONVERTED + 1))
  else
    echo "실패"
    FAILED=$((FAILED + 1))
  fi
done < <(find "$TARGET_DIR" -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) -print0)

# ======================================
# 최종 결과 출력
# ======================================
echo ""
echo "==========================================="
echo "변환 완료"
echo "   변환: ${CONVERTED}개"
echo "   스킵: ${SKIPPED}개"
echo "   실패: ${FAILED}개"
echo "==========================================="