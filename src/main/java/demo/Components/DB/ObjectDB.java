package demo.Components.DB;


import demo.Documents.ObjectEntity;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.repository.query.Param;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ObjectDB extends ReactiveMongoRepository<ObjectEntity, String> {


    public Flux<ObjectEntity> findAllByActiveTrue(); // MINIAPP VERSION

    public Mono<ObjectEntity> findByObjectIdAndActiveTrue(@Param("objectId") String id); // MINIAPP VERSION

    public Flux<ObjectEntity> findAllByType(@Param("type") String type); // SUPERAPP VERSION

    @Query("{ 'createdBy.userId.email' : ?0, 'active': true, 'type':  ?1}")
    public Flux<ObjectEntity> findAllByTypeAndEmailAndActiveTrue(String email, String type); // MINIAPP VERSION

    //    public Flux<ObjectEntity> findAllByTypeAndExecuterEmailAndActiveTrue(@Param("executerEmail") String executerEmail, @Param("type") String type); // MINIAPP VERSION
    public Flux<ObjectEntity> findAllByTypeAndActiveTrue(@Param("type") String type);

    public Flux<ObjectEntity> findAllByAlias(@Param("alias") String alias); // SUPERAPP VERSION

    public Flux<ObjectEntity> findAllByAliasAndActiveTrue(@Param("type") String type); // MINIAPP VERSION

    public Flux<ObjectEntity> findAllByAliasContaining(@Param("pattern") String pattern); // SUPERAPP VERSION

    public Flux<ObjectEntity> findAllByAliasContainingAndActiveTrue(@Param("pattern") String pattern); // MINIAPP VERSION

    public Flux<ObjectEntity> findAllByTypeAndAlias(@Param("type") String type, @Param("alias") String alias); // SUPERAPP VERSION

    @Query("{ 'active' : true ,'alias' :  ?1, 'type' :  ?0, 'objectDetails.isAccepted' : ?2  }")
    public Flux<ObjectEntity> findAllRequestsOf(String type, String alias, String state); // SUPERAPP VERSION

    public Flux<ObjectEntity> findAllByTypeAndAliasAndActiveTrue(@Param("type") String type, @Param("alias") String alias); // MINIAPP VERSION
}
