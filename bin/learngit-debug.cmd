@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe --debug"  "%~dp0\..\learngit.js" %*
) ELSE (
  node --debug "%~dp0\..\learngit.js" %*
)