@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\lancet-icu.js" %*
) ELSE (
  node  "%~dp0\..\lancet-icu.js" %*
)