package demo.Components.Service.Interfaces;

import demo.Boundaries.MiniAppCommand.MiniAppCommandBoundary;
import reactor.core.publisher.Flux;

public interface CommandService {

    Flux<Object> invokeCommand(String miniAppName, MiniAppCommandBoundary appCommandBoundary);
}
