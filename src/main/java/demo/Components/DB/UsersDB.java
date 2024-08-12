package demo.Components.DB;

import demo.Documents.UserEntity;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Mono;

public interface UsersDB extends ReactiveMongoRepository<UserEntity, String> {

}
