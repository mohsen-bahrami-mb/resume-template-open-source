// import modules
import winston from "winston";

// destructure variables
const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, json } = format;

// make logger object
export let logger: winston.Logger;
export default (function () {
    /**
     * add errors to "logfile.log"
     * handle errors outside of application
    */
    if (process.env.NODE_ENV === "development") {
        logger = createLogger({
            level: "error",
            format: combine(
                timestamp(),
                printf(i => `${i.timestamp} [${i.label}] ${i.level}: ${i.message}`),
            ),
            transports: [
                new winston.transports.Console({ handleExceptions: true, handleRejections: true })
            ]
        });
    } else {
        logger = createLogger({
            level: "error",
            format: combine(
                timestamp(),
                printf(i => `${i.timestamp} [${i.label}] ${i.level}: ${i.message}`),
                json()
            ),
            transports: [
                new transports.File({ filename: 'logfile.log', handleExceptions: true, handleRejections: true }),
                // new winston.transports.Console({ handleExceptions: true, handleRejections: true })
            ]
        });
    }

})();