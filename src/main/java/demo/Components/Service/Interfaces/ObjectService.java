package demo.Components.Service.Interfaces;

import demo.Boundaries.Objects.ObjectBoundary;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ObjectService {

    public Mono<ObjectBoundary> createNewObject(ObjectBoundary objectBoundary);
    public Mono<Void> updateObject(ObjectBoundary objectBoundary, String id, String userSuperapp, String email, String superapp);
    public Mono<ObjectBoundary> getObject(String id, String userSuperapp, String email, String superapp);
    public Flux<ObjectBoundary> getAllObjects(String superapp, String email);

}
