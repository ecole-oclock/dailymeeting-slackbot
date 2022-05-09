/*
 * Package Import
 */
import { Router } from 'express';

/*
 * Local Import
 */
import slack from 'src/controllers/slack';

/*
 * Init
 */
const routes = new Router();

/*
 * Export default
 */
export default (app) => {
    /*
    * Routes
    */

    routes.post('/commands', slack.processCommand);
    routes.post('/events', slack.processEvents);
    app.use(routes);

    // 404 - Page Not Found
    //   routes.use(errorHandlers.notFound);
    return app;
};
