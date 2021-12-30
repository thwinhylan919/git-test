@echo off
SETLOCAL
set OBDX_IGNORE_LINTER_ERRORS=false
set OBDX_LINTER_BLAME=disable
set errorlevel=
node download-lib.js && node preBuildChecks.js --verbose && node eslint-jsdoc.js && node eslint.js -D
if %errorlevel% neq 0 (
echo Couldn't complete all checks, please do not commit! 1>&2
) else (
echo All checks passed, you can proceed with commit 1>&2
)
ENDLOCAL
pause