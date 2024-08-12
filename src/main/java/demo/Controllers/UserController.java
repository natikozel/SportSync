package demo.Controllers;

import demo.Boundaries.User.NewUserBoundary;
import demo.Boundaries.User.UserBoundary;
import demo.Components.Service.Interfaces.UsersService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping(path ={"superapp/users"})
@CrossOrigin
public class UserController {

    private final UsersService userService;


    public UserController(UsersService userService) {
        this.userService = userService;
    }

    @PostMapping(
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public Mono<UserBoundary> createNewUser(
            @RequestBody NewUserBoundary user) {
        return userService.createNewUser(user);
    }

    @GetMapping(
            path={"/login/{superapp}/{email}"},
            produces={MediaType.APPLICATION_JSON_VALUE})
    public Mono<UserBoundary> login(
            @PathVariable("superapp") String superapp,
            @PathVariable("email") String email) {
        return userService.login(email, superapp);
    }

    @PutMapping(
            path={"/{superapp}/{userEmail}"},
            consumes={MediaType.APPLICATION_JSON_VALUE},
            produces={MediaType.APPLICATION_JSON_VALUE})
    public Mono<Void> update(
            @PathVariable("superapp") String superapp,
            @PathVariable("userEmail") String email,
            @RequestBody UserBoundary userBoundary) {
        System.err.println(userBoundary);
        return userService.update(email, userBoundary, superapp);
    }

}
