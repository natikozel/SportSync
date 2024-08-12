package demo.Controllers;

import demo.Boundaries.Objects.ObjectBoundary;
import demo.Components.Service.Interfaces.ObjectService;
import demo.Exceptions.BadRequestException;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping(path = {"superapp/objects"})
@CrossOrigin
public class ObjectController {

    private final ObjectService objectService;

    public ObjectController(ObjectService objectService) {
        this.objectService = objectService;
    }

    @PostMapping(
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public Mono<ObjectBoundary> createNewObject(
            @RequestBody ObjectBoundary objectBoundary) {
        return this.objectService.createNewObject(objectBoundary);
    }

    @PutMapping(
            path = "/{superapp}/{id}",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public Mono<Void> updateObject(
            @RequestBody ObjectBoundary objectBoundary,
            @PathVariable("id") String id,
            @PathVariable("superapp") String superapp,
            @RequestParam(name = "userSuperapp", required = true) String userSuperapp,
            @RequestParam(name = "userEmail", required = true) String email) {
        return this.objectService.updateObject(objectBoundary, id, userSuperapp, email, superapp);
    }

    @GetMapping(
            path = "/{superapp}/{id}",
            produces = {MediaType.APPLICATION_JSON_VALUE})
    public Mono<ObjectBoundary> getObject(
            @PathVariable("id") String id,
            @PathVariable("superapp") String superapp,
            @RequestParam(name = "userSuperapp", required = true) String userSuperapp,
            @RequestParam(name = "userEmail", required = true) String email) {
        return this.objectService.getObject(id, userSuperapp, email, superapp);
    }

    @GetMapping(produces = {MediaType.TEXT_EVENT_STREAM_VALUE})
    public Flux<ObjectBoundary> getAllObjects(
            @RequestParam(name = "userSuperapp", required = true) String superapp,
            @RequestParam(name = "userEmail", required = true) String email
    ) {
        return this.objectService.getAllObjects(superapp, email);
    }

}
