/*
 * Package Import
 */
import 'dotenv-flow/config';
import logger from 'src/utils/logger';
/*
 * Local Import
 */
import app from './index';

/*
 * Server • Node.js
 */
const port = process.env.SERVER_PORT;
if (!port) {
  logger.error("ヽ༼ ಠ益ಠ ༽ﾉ  Il y a un problème avec la variable d'env SERVER_PORT");
}
const server = app.listen(port, () => {
  logger.info('🤖  Node.js is running :');
  logger.info(`→ PORT *:${port}`);
  logger.info(`→ ENV : ${process.env.NODE_ENV}`);
});

export default server;
