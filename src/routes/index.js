/*
 * Package Import
 */
import { Router } from 'express';

/*
 * Local Import
 */


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
  app.use('/', routes);

  // 404 - Page Not Found
//   routes.use(errorHandlers.notFound);
};
