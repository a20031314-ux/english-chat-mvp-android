# PC에서 출시 빌드 준비를 한 번에: npm run pc:build  (또는 .\scripts\pc-build.ps1)
# 하는 일: PC에서 저절로 바뀌는 파일 되돌리기 → 최신 받기 → 패키지 설치(lock 파일 안 바꿈)
#          → 안드로이드 빌드 → 버전 확인 → Android Studio 열기.
# 서명(Signed Bundle)은 하지 않는다 — Android Studio에서 사람이 한다.
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
Set-Location (Split-Path $PSScriptRoot -Parent)

function Step($text) { Write-Host ""; Write-Host "== $text" -ForegroundColor Cyan }
function Fail($text) { Write-Host ""; Write-Host "멈춤: $text" -ForegroundColor Red; exit 1 }

Step "1/5 PC에서 저절로 바뀌는 파일 되돌리기 (build.gradle, package-lock.json)"
git checkout -- android/app/build.gradle package-lock.json
if ($LASTEXITCODE -ne 0) { Fail "git checkout 실패" }
$dirty = git status --porcelain --untracked-files=no
if ($dirty) {
  Write-Host $dirty
  Fail "위 파일을 PC에서 고친 상태라 받기 전에 멈춥니다. 필요 없으면 git checkout -- <파일> 후 다시 실행하세요."
}

Step "2/5 최신 받기 (git pull)"
git pull --ff-only
if ($LASTEXITCODE -ne 0) { Fail "git pull 실패 — 위 메시지를 Claude에게 보내 주세요." }

Step "3/5 패키지 설치 (npm ci — lock 파일을 바꾸지 않음)"
npm ci
if ($LASTEXITCODE -ne 0) { Fail "npm ci 실패 — Android Studio·에뮬레이터를 닫고 다시 실행해 보세요." }

Step "4/5 안드로이드 빌드 (npm run build:android)"
npm run build:android
if ($LASTEXITCODE -ne 0) { Fail "빌드 실패 — 위 메시지를 Claude에게 보내 주세요." }

Step "5/5 버전 확인"
$want = (Get-Content package.json -Raw -Encoding UTF8 | ConvertFrom-Json).version
$got = (Get-Content android\app\src\main\assets\public\build-version.txt -Raw).Trim()
$gradle = Get-Content android\app\build.gradle -Raw
$code = [regex]::Match($gradle, 'versionCode\s+(\d+)').Groups[1].Value
$name = [regex]::Match($gradle, 'versionName\s+"([^"]+)"').Groups[1].Value
Write-Host "package.json $want / 빌드 $got / build.gradle $name ($code)"
if ($got -ne $want) { Fail "빌드에 들어간 버전($got)이 저장소 버전($want)과 다릅니다." }
if (-not $want.StartsWith($name)) { Fail "build.gradle versionName($name)이 package.json($want)과 다릅니다." }

Write-Host ""
Write-Host "준비 끝: $name (versionCode $code)" -ForegroundColor Green
Write-Host "Android Studio에서 Sync → Build > Generate Signed Bundle 을 하세요."
npx cap open android
