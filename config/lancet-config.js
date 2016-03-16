module.exports = {
    db: {
        USER: "lancet-icu",
        PASS: "lancet-icu@dfsoft",
        HOST: "localhost",
        DATABASE: "recruit",
        PORT: "3306",
        CHARSET: "UTF8_GENERAL_CI",
        SHOWSQL:true,
        connectionLimit: 10
    },
    mode: "full",   // full：完整版   lite：定制版    standard：标准版
    port: 5000, //端口号
    clusterNum: 1, //子进程数量，min:1 max: cup数量; 可选参数,默认值1
    isMainProcess: true, //是否是主进程;用于nginx负载均衡时配置，后台自动取数只在主进程中执行;对于多cluster方式，此参数无效。可选参数,默认值true
    isNginx: false //是否是nginx部署模式,可选参数.默认值false
}