package demo.Components.Service.Interfaces;

import demo.Boundaries.User.NewUserBoundary;
import demo.Boundaries.User.UserBoundary;
import reactor.core.publisher.Mono;

public interface UsersService {
    public Mono<UserBoundary> createNewUser(NewUserBoundary userBoundary);

    public Mono<UserBoundary> login(String email, String superapp);

    public Mono<Void> update(String email, UserBoundary userBoundary, String superapp);


}
