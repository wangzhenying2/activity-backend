#!/bin/sh

BASE=`pwd`

echo '======='
node -v
#package check
python bin/precheck.py

#2 调用nodejs 并保存临时文件
npm run build


