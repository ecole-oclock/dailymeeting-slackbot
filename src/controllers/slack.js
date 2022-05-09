import slackCommandsService from 'src/services/slackCommands';
import slackEventsService from 'src/services/slackEvents';
import logger from 'src/utils/logger';

const slack = {
    processCommand: (req, res, next) => {
        if (slackCommandsService[req.body.command]) {
            return slackCommandsService[req.body.command](req, res, next)(req.body);
        }
        return res.send('Heuuu cette commande n\'est pas encore implémentée mon p\'tit pigeon !');
    },
    processEvents: (req, res, next) => {
        const { challenge, event } = req.body;
        if (event?.type && slackEventsService[event?.type]) {
            logger.info(`Réception d'un event ${event?.type} de l'utilisateur ${event?.user}`);
            return slackEventsService[event.type](req, res, next)(challenge, event);
        }
        if (!event?.type) {
            logger.info('Réception d\'un event sans type', event);
        } else {
            logger.info('Réception d\'un event inconnu', event);
        }
        return res.json({ challenge });
    },
};

export default slack;
