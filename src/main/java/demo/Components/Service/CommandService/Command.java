package demo.Components.Service.CommandService;

import demo.Boundaries.MiniAppCommand.MiniAppCommandBoundary;
import demo.Components.DB.ObjectDB;
import demo.Components.DB.UsersDB;
import demo.Components.Service.Interfaces.ObjectService;
import demo.Components.Service.Interfaces.UsersService;
import reactor.core.publisher.Flux;

public interface Command {
    public Flux<Object> invoke (MiniAppCommandBoundary command,
                                ObjectService objectService,
                                UsersService userService,
                                ObjectDB objectDB,
                                UsersDB userDB);
}
