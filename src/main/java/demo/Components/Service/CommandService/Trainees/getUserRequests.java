package demo.Components.Service.CommandService.Trainees;

import demo.Boundaries.MiniAppCommand.MiniAppCommandBoundary;
import demo.Boundaries.Objects.ObjectBoundary;
import demo.Components.DB.ObjectDB;
import demo.Components.DB.UsersDB;
import demo.Components.Service.Interfaces.ObjectService;
import demo.Components.Service.Interfaces.UsersService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;


@Component(value = "getUserRequests")
public class getUserRequests implements TraineeCommand {
    private final Log logger = LogFactory.getLog(getUserRequests.class);

    @Override
    public Flux<Object> invoke(MiniAppCommandBoundary command, ObjectService objectService, UsersService userService, ObjectDB objectDB, UsersDB userDB) {
        logger.trace("getUserRequests invoked");
        logger.trace("Using findAllByTypeAndEmailAndActiveTrue Query");
        return objectDB
                .findAllByTypeAndEmailAndActiveTrue(command.getInvokedBy().getUserId().getEmail(), "Request")
                .map(
                        entity -> {
                            logger.trace("Returning ObjectBoundary");
                            return new ObjectBoundary(entity);
                        })
                .cast(Object.class)
                .log();
    }
}
