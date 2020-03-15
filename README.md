# Outliner
A tool for generating extern.js file for js/ts library when using google-closure-compiler

When we use Google-Closure-Compiler to minimize JS/TS library, we should write a extern.js file to tell Google-Closure-Compiler DONNOT CHANGE API NAMES which listed in extern.js

If we do this manually, it would be such a horrible task and there would be easily to make mistakes. This tool can generate extern.js file automatically by scanning source code. 

### TODO
1. 支持namespace，可以支持多个namespace以及动态分析jsdoc的@namespace注释
2. 支持json对象，全局函数
3. 命令行工具
4. 优化json配置解析，可以新开json文件，也可以写在package.json里
5. 用ts改写该工具，优化代码，规范风格
6. 单元测试
7. watch
