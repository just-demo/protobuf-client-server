if exist ..\build del ..\build /q /s
mkdir ..\build
copy ..\public\index.html ..\build\index.html
browserify ../src/index.js -o ../build/bundle.js
