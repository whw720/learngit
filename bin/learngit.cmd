@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\learngit.js" %*
) ELSE (
  node  "%~dp0\..\learngit.js" %*
)