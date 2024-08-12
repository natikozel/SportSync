package demo.Controllers;

import demo.Boundaries.Objects.ObjectBoundary;
import demo.Components.Service.Interfaces.ObjectSearchService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping(path = {"superapp/objects/search"})
@CrossOrigin

public class ObjectSearchController {

    private final ObjectSearchService objectSearchService;

    public ObjectSearchController(ObjectSearchService objectSearchService) {
        this.objectSearchService = objectSearchService;
    }

    @GetMapping(
            path = "/byType/{type}",
            produces = {MediaType.TEXT_EVENT_STREAM_VALUE})
    public Flux<ObjectBoundary> searchByType(
            @PathVariable("type") String type,
            @RequestParam(name = "userSuperapp", required = true) String superapp,
            @RequestParam(name = "userEmail", required = true) String email) {
        return this.objectSearchService.searchByType(type, superapp, email);
    }

    @GetMapping(
            path = "/byAlias/{alias}",
            produces = {MediaType.TEXT_EVENT_STREAM_VALUE})
    public Flux<ObjectBoundary> searchByAlias(
            @PathVariable("alias") String alias,
            @RequestParam(name = "userSuperapp", required = true) String superapp,
            @RequestParam(name = "userEmail", required = true) String email) {
        return this.objectSearchService.searchByAlias(alias, superapp, email);
    }

    @GetMapping(
            path = "/byAliasPattern/{pattern}",
            produces = {MediaType.TEXT_EVENT_STREAM_VALUE})
    public Flux<ObjectBoundary> searchByAliasPattern(
            @PathVariable("pattern") String pattern,
            @RequestParam(name = "userSuperapp", required = true) String superapp,
            @RequestParam(name = "userEmail", required = true) String email) {
        return this.objectSearchService.searchByAliasPattern(pattern, superapp, email);
    }
}
