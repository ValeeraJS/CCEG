const config = {
    source: {
        path: ['./testcode/', './fff/'],
        include: "\\.(ts)$", // 文件匹配正则
        exclude: "\\.(test.ts)$", // 不包括的文件的正则
    },
    output: './extern.js',
    api: {
        namespace: 'Fruit',
        include: {
            access: ["public", "protected", "default"],
            commentTag: ["@api"]
        },
        exclude: {
            access: ["private"],
            commentTag: ["@invisible"]
        }
    }
}

module.exports = config;
