/* eslint-disable max-len */
/* eslint-disable no-unused-expressions */
/*
 * Package Import
 */
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dayjs from 'dayjs';

import 'dayjs/locale/fr';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';
import Calendar from 'dayjs/plugin/calendar';
import IsoWeek from 'dayjs/plugin/isoWeek';
import Timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import UpdateLocale from 'dayjs/plugin/updateLocale';
import meetingsData from 'src/utils/meetingsData';

/*
 * Local Import
 */
import routes from 'src/routes';
import logger from 'src/utils/logger';

/*
 * Init
 */
// Dayjs
dayjs.extend(CustomParseFormat);
dayjs.extend(utc);
dayjs.extend(Timezone);
dayjs.extend(IsoWeek);
dayjs.extend(Calendar);
dayjs.extend(UpdateLocale);
dayjs.locale('fr');
dayjs.updateLocale('fr', {
    calendar: {
        lastDay: '[Hier at]',
        sameDay: "[Aujourd'hui]",
        nextDay: '[Demain]',
        lastWeek: 'dddd [dernier]',
        nextWeek: 'dddd',
        sameElse: 'L',
    },
});
dayjs.tz.setDefault('Europe/Paris');

// Express
const app = express();

/*
 * Middlewares
 */

// Logger
// API : https://github.com/expressjs/morgan
// `dev` is equal to `:method :url :status :response-time ms`
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Disable the X-Powered-By header.
// Attackers can use this header to detect apps running Express
// And then launch specifically-targeted attacks
app.disable('x-powered-by');

// BodyParser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS
// API : https://github.com/expressjs/cors#configuration-options
app.use(
    cors({
        origin: true, // Pour accepter n'importe quelle origine
    }),
);

/*
 * Routes
 */
app.use((req, res, next) => {
    meetingsData.logMeetings();
    next();
});
routes(app);
/*
 * Middleware de gestion d'erreur
 */

app.use((err, req, res, next) => {
    logger.error(err, err.stack);
    if (res.headersSent) {
        return next(err);
    }
    return res.status(500).send(err.message);
});

/*
 * Export
 */
export default app;
