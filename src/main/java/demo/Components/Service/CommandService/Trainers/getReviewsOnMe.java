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

import java.util.Objects;

@Component(value = "getReviewsOnMe")
public class getReviewsOnMe implements TrainerCommand {
    private Log logger = LogFactory.getLog(getReviewsOnMe.class);
    @Override
    public Flux<Object> invoke(MiniAppCommandBoundary command, ObjectService objectService, UsersService userService, ObjectDB objectDB, UsersDB userDB) {
        logger.trace("getReviewsOnMe invoke" + command);
        return objectDB
                .findAllByTypeAndAlias("Review", command.getInvokedBy().getUserId().getEmail())
                .map(//ObjectBoundary::new)
                        entity -> {
                            logger.trace("getReviewsOnMe invoke ObjectBoundary suucssefully");
                            return new ObjectBoundary(entity);
                        })
                .cast(Object.class)
                .log();
    }
}
