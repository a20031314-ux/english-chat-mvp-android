#!/bin/bash
cd /home/claude/english-chat-mvp-android
for l in $LOCS; do echo "== $l $(date +%T)"; LOCALE=$l PORT=4591 timeout 1200 node scripts/guide-slides/shoot.mjs 2>&1 | grep -E "못 찍음|모양|Error"; done
echo "== 끝 $(date +%T)"
