package demo.Components.Service.Interfaces;

import demo.Boundaries.Objects.ObjectBoundary;
import reactor.core.publisher.Flux;

public interface ObjectSearchService extends ObjectService {

    public Flux<ObjectBoundary> searchByType(String type, String superapp, String email);
    public Flux<ObjectBoundary> searchByAlias(String alias, String superapp, String email);
    public Flux<ObjectBoundary> searchByAliasPattern(String pattern, String superapp, String email);
}
