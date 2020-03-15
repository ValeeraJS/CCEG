# Outliner
A tool for generating extern.js file for js/ts library when using google-closure-compiler

When we use Google-Closure-Compiler to minimize JS/TS library, we should write a extern.js file to tell Google-Closure-Compiler DONNOT CHANGE API NAMES which listed in extern.js

If we do this manually, it would be such a horrible task and there would be easily to make mistakes. This tool can generate extern.js file automatically by scanning source code. 
