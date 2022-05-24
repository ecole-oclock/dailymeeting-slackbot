import slackCommandsService from 'src/services/slackCommands';
import slackEventsService from 'src/services/slackEvents';
import slackInteractiveService from 'src/services/slackInteractive';
import logger from 'src/utils/logger';

const slack = {
    processCommand: (req, res, next) => {
        if (slackCommandsService[req.body.command]) {
            logger.info(`Traitement de la commande ${req.body.command} lancée par ${req.body.user_name}`);
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
    processInteractive: (req, res, next) => {
        const payload = JSON.parse(req.body.payload);
        if (payload?.type && slackInteractiveService?.[payload?.type]?.[payload?.actions?.[0]?.action_id]) {
            logger.info(`Réception d'un event ${payload?.type} pour l'action ${payload?.actions?.[0]?.action_id} de l'utilisateur ${payload?.user?.username}`);
            return slackInteractiveService[payload.type][payload.actions[0].action_id](req, res, next)(payload);
        }
        if (!payload?.type) {
            logger.warn(`Réception d'un payload sans type ${JSON.stringify(payload)}`);
        } else if (!payload?.action || !payload?.action.length) {
            logger.warn(`Réception d'un payload ${payload.type} sans action ${JSON.stringify(payload)}`);
        } else {
            logger.warn(`Réception d'un payload ${payload.type} inconnu ${JSON.stringify(payload)}`);
        }
        return res.json();
    },
};

export default slack;
