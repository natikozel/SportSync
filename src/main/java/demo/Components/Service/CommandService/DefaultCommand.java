package demo.Components.Service.CommandService;

import demo.Boundaries.MiniAppCommand.MiniAppCommandBoundary;
import demo.Components.DB.ObjectDB;
import demo.Components.DB.UsersDB;
import demo.Components.Service.Interfaces.ObjectService;
import demo.Components.Service.Interfaces.UsersService;
import demo.Exceptions.BadRequestException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;

@Component(value = "defaultCommand")
public class DefaultCommand implements Command {
    private Log logger = LogFactory.getLog(DefaultCommand.class);
    @Override
    public Flux<Object> invoke(MiniAppCommandBoundary command, ObjectService objectService, UsersService userService, ObjectDB objectDB, UsersDB userDB) {
        logger.trace("DefaultCommand invoke" + command + "Command not found");
        return Flux.error(() -> new BadRequestException("Command not found"));
    }
}
