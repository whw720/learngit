@IF EXIST "%~dp0\nodemon.exe" (
  "%~dp0\nodemon.exe"  "%~dp0\..\lancet-icu.js" %*
) ELSE (
  nodemon  "%~dp0\..\lancet-icu.js" %*
)