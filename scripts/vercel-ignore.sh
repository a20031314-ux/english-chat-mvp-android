#!/usr/bin/env bash
# Vercel "Ignored Build Step"(vercel.json ignoreCommand): 0 = 빌드 건너뜀, 1 = 빌드.
# 허브·.claude·AGENTS.md·CLAUDE.md만 바뀐 커밋은 건너뛴다.
# 지난 배포 커밋이 얕은 clone에 없으면(허브 커밋이 10개 넘게 쌓였을 때) git diff가 128로 실패해
# 배포가 전부 Error가 됐다(2026-11-10 14:35부터) — 없으면 받아 보고, 그래도 없거나 다른 오류면 빌드한다.
prev="${VERCEL_GIT_PREVIOUS_SHA:-}"
if [ -z "$prev" ]; then exit 1; fi
git cat-file -e "$prev^{commit}" 2>/dev/null || git fetch --quiet --depth=500 origin "$prev" 2>/dev/null || true
git cat-file -e "$prev^{commit}" 2>/dev/null || exit 1
git diff --quiet "$prev" HEAD -- . ':(exclude)hub' ':(exclude).claude' ':(exclude)AGENTS.md' ':(exclude)CLAUDE.md'
code=$?
if [ "$code" -eq 0 ]; then exit 0; fi
exit 1
