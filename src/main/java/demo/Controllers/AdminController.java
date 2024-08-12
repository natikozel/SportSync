package demo.Controllers;


import demo.Boundaries.MiniAppCommand.MiniAppCommandBoundary;
import demo.Boundaries.User.UserBoundary;
import demo.Components.Service.Interfaces.AdminService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping(path = {"superapp/admin"})
@CrossOrigin
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @DeleteMapping(
            path = {"/users"})
    public Mono<Void> deleteAllUsers(
            @RequestParam(name = "userSuperapp", required = true) String superapp,
            @RequestParam(name = "userEmail", required = true) String email) {
        return this.adminService.deleteAllUsers(superapp, email);
    }

    @DeleteMapping(
            path = {"/objects"})
    public Mono<Void> deleteAllObjects(
            @RequestParam(name = "userSuperapp", required = true) String superapp,
            @RequestParam(name = "userEmail", required = true) String email) {
        return this.adminService.deleteAllObjects(superapp, email);
    }

    @DeleteMapping(
            path = {"/miniapp"})
    public Mono<Void> deleteAllCommands(
            @RequestParam(name = "userSuperapp", required = true) String superapp,
            @RequestParam(name = "userEmail", required = true) String email) {
        return this.adminService.deleteAllCommands(superapp, email);
    }

    @GetMapping(
            path = {"/users"},
            produces = {MediaType.TEXT_EVENT_STREAM_VALUE})
    public Flux<UserBoundary> getAllUsers(
            @RequestParam(name = "userSuperapp", required = true) String superapp,
            @RequestParam(name = "userEmail", required = true) String email) {
        return this.adminService.getAllUsers(superapp, email);
    }

    @GetMapping(
            path = {"/miniapp"},
            produces = {MediaType.TEXT_EVENT_STREAM_VALUE})
    public Flux<MiniAppCommandBoundary> getAllCommandsHistory(
            @RequestParam(name = "userSuperapp", required = true) String superapp,
            @RequestParam(name = "userEmail", required = true) String email) {
        return this.adminService.getAllCommandsHistory(superapp, email);
    }

    @GetMapping(
            path = {"/miniapp/{miniAppName}"},
            produces = {MediaType.TEXT_EVENT_STREAM_VALUE})
    public Flux<MiniAppCommandBoundary> getAllSpecificAppCommandsHistory(
            @PathVariable("miniAppName") String miniAppName,
            @RequestParam(name = "userSuperapp", required = true) String superapp,
            @RequestParam(name = "userEmail", required = true) String email) {
        return this.adminService.getAllSpecificAppCommandsHistory(miniAppName, superapp, email);
    }
}
