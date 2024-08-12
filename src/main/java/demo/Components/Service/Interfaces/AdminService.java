package demo.Components.Service.Interfaces;

import demo.Boundaries.MiniAppCommand.MiniAppCommandBoundary;
import demo.Boundaries.User.UserBoundary;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface AdminService {

    public Mono<Void> deleteAllUsers(String superapp, String email);
    public Mono<Void> deleteAllObjects(String superapp, String email);
    public Mono<Void> deleteAllCommands(String superapp, String email);
    public Flux<UserBoundary> getAllUsers(String superapp, String email);
    public Flux<MiniAppCommandBoundary> getAllCommandsHistory(String superapp, String email);
    public Flux<MiniAppCommandBoundary> getAllSpecificAppCommandsHistory(String miniAppName, String superapp, String email);

}
