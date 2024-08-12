package demo.Components.Service.CommandService.Trainers;

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



@Component(value = "getMyAcceptedRequests")
public class getMyAcceptedRequests implements TrainerCommand {
    private final Log logger = LogFactory.getLog(getMyAcceptedRequests.class);

    @Override
    public Flux<Object> invoke(MiniAppCommandBoundary command, ObjectService objectService, UsersService userService, ObjectDB objectDB, UsersDB userDB) {
        logger.trace("getMyAcceptedRequests invoked");
        logger.trace("Using findAllRequestsOf Query");
        return objectDB
                .findAllRequestsOf("Request", command.getInvokedBy().getUserId().getEmail(), "ACCEPTED")
                .map(
                        entity -> {
                            logger.trace("Returning ObjectBoundary");
                            return new ObjectBoundary(entity);
                        })
                .cast(Object.class)
                .log();
    }
}
