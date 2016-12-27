/**
 * @file Global Config File
 * @author zhangziqiu@baidu.com
 */
/* global oojs */
oojs.define({
    name: 'global',
    namespace: 'rs.common.config',
    // 日志配置部分
    log: {
        // 客户进程向主进程发送日志消息的时间间隔, 单位ms
        clientTimeSpan: 1000,
        // 主进程写文件的时间间隔, 单位ms
        masterTimeSpan: 1000,
        // 每个多少分钟切割文件, 单位分钟.
        fileTimeSpan: 15,
        // 日志目录
        filePath: './logs/',
        // info和notice级别日志记录的文件名
        accessFileName: 'render_server.log',
        // error和fatal级别的日志记录的文件名
        fatalFileName: 'render_server.log.wf',
        // 日志级别
        level: 'info'

    },
    // 服务器配置部分
    server: {
        // 服务端口号
        port: 8124,
        // 连接超时时间
        socketTimeout: 30000,
        // 连接队列深度
        queueLength: 255,
        // CPU是否支持超线程
        ht: false,
        // 定时重启间隔，单位ms，默认4h
        updateInterval: 14400000

    },
    // 数据库配置部分, 更多配置参见 http://sequelize.readthedocs.org/en/latest/docs/usage/#options
    db: {
        // 数据库名字, 用户名和密码
        database: 'nova_ts_liguangyi',
        readUsername: 'root',
        readPassword: '123456',
        writeUsername: 'root',
        writePassword: '123456',
        // custom host; default: 127.0.0.1, 10.26.5.15
        host: '10.48.116.31',
        // custom port; default: 3306
        port: 8877,
        // max concurrent database requests; default: 50
        maxConcurrentQueries: 1,
        // the sql dialect of the database
        // - default is 'mysql'
        // - currently supported: 'mysql', 'sqlite', 'postgres', 'mariadb'
        dialect: 'mysql',
        // 关闭SQL语句日志
        logging: false

    },
    // db: {
    //     // 数据库名字, 用户名和密码
    //     database: 'nova_ts',
    //     readUsername: 'nova_ts_rw',
    //     readPassword: 'AeXnGdAa4A1mDDcK',
    //     writeUsername: 'nova_ts_rw',
    //     writePassword: 'AeXnGdAa4A1mDDcK',
    //     // custom host; default: 127.0.0.1, 10.26.5.15
    //     host: '10.26.5.15',
    //     // custom port; default: 3306
    //     port: 4307,
    //     // max concurrent database requests; default: 50
    //     maxConcurrentQueries: 1,
    //     // the sql dialect of the database
    //     // - default is 'mysql'
    //     // - currently supported: 'mysql', 'sqlite', 'postgres', 'mariadb'
    //     dialect: 'mysql',
    //     // 关闭SQL语句日志
    //     logging: false

    // },

    // master进程健康检查配置项
    healthCheck: {
        // 每个健康检查周期内启动多少次则认为是错误
        restartLimitTimes: 10,
        // 健康检查周期的时间, 单位毫秒,默认为1秒
        healthCheckTime: 1000

    },

    // 静态资源类配置
    resource: {
        baseCssUrl: 'https://cpro.baidustatic.com/cpro/ui/noexpire/css/2.1.3/template.min.css',
        baseJsUrl: 'https://cpro.baidustatic.com/cpro/ui/noexpire/js/2.0.1/oojs.js',
        logo1: 'https://cpro.baidustatic.com/cpro/ui/noexpire/js/2.0.3/logo.min.js',
        logo2: 'https://cpro.baidustatic.com/cpro/ui/noexpire/js/2.0.3/logo.min.js',
        adIcon: 'https://cpro.baidustatic.com/cpro/ui/noexpire/js/2.0.3/icon.min.js'
    },

    // 缓存配置部分
    cache: {
        // 是否开启数据库监控, 定期更新文件缓存
        startFileMonitor: true,
        // 缓存文件保存的目录
        cacheFilePath: './cache/',
        // 数据库监控的间隔时间, 单位秒
        databaseIntervalSeconds: 10,
        // 文件监控的间隔时间, 单位秒
        fileIntervalSeconds: 240
    }
});

