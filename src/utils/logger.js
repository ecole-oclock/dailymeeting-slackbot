import winston from "winston";

const logLevel = process.env.LOG_LEVEL || "debug";
const logLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        sql: 4,
        debug: 5
    },
    colors: {
        error: "red",
        warn: "yellow",
        info: "blue",
        http: "green",
        sql: "magenta",
        debug: "cyan"
    }
};

winston.addColors(logLevels.colors);

const logger = winston.createLogger({
    level: logLevel,
    levels: logLevels.levels,
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf((info) => {
            const {
                timestamp, level, message, ...args
            } = info;
            const ts = timestamp.slice(0, 19).replace("T", " ");
            return `${ts} [${level}]: ${message.trim()} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ""}`;
        }),
    ),
    transports: [
        new winston.transports.Console({
            level: logLevel
        })
    ]
});

export default logger;