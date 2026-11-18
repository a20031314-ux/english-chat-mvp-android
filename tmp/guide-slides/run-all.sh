#!/bin/bash
# 13개 앱 언어 장면 재료 찍기 — 로그 tmp/guide-slides/run-all.log
cd /home/claude/english-chat-mvp-android
LOCS="en es ja zh vi fr it pt ru id ar th hi"
ALL=$(echo $LOCS | tr ' ' ',')
export API_BASE=https://www.languagebank.net
for mode in store-tabs guide-social guide-more guide-video; do
  echo "== $mode $(date +%T)"
  CAPTURE_RUN=g1116$mode timeout 3000 node --experimental-strip-types scripts/capture-whats-new.mjs $mode --only $ALL 2>&1 | grep -E "^(en|es|ja|zh|vi|fr|it|pt|ru|id|ar|th|hi) " | grep -v "^\S* \s*\[" | cut -c1-120
  for l in $LOCS; do mkdir -p tmp/guide-slides/src/$l; for f in $(git status --short public/guide/$l | awk '{print $2}'); do cp $f tmp/guide-slides/src/$l/; done; done
  git checkout -- public/guide; git clean -fdq public/guide
done
for l in $LOCS; do
  echo "== shoot $l $(date +%T)"
  LOCALE=$l timeout 900 node scripts/guide-slides/shoot.mjs 2>&1 | grep -E "못 찍음|모양" 
  LOCALE=$l timeout 600 node scripts/guide-slides/shoot-call.mjs 2>&1 | grep -E "못 찍음"
  ls tmp/guide-slides/raw/$l | wc -l
done
echo "== 끝 $(date +%T)"
