package demo.Controllers;

import demo.Boundaries.MiniAppCommand.MiniAppCommandBoundary;
import demo.Components.Service.Interfaces.CommandService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping(path = {"superapp/miniapp"})
@CrossOrigin
public class CommandController {

    private final CommandService miniAppService;

    public CommandController(CommandService miniAppService) {
        this.miniAppService = miniAppService;
    }

    @PostMapping(
            path = {"/{miniAppName}"},
            produces = {MediaType.APPLICATION_JSON_VALUE},
            consumes = {MediaType.APPLICATION_JSON_VALUE})
    public Flux<Object> InvokeMiniAppCommand(
            @PathVariable("miniAppName") String miniAppName,
            @RequestBody MiniAppCommandBoundary miniAppCommandBoundary) {
        return miniAppService.invokeCommand(miniAppName, miniAppCommandBoundary);

    }
}
