@IF EXIST "%~dp0\nodemon.exe" (
  "%~dp0\nodemon.exe"  "%~dp0\..\learngit.js" %*
) ELSE (
  nodemon  "%~dp0\..\learngit.js" %*
)