package demo.Components.DB;

import demo.Documents.MiniAppCommandEntity;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.repository.query.Param;
import reactor.core.publisher.Flux;


public interface CommandDB extends ReactiveMongoRepository<MiniAppCommandEntity, String> {
	
	public Flux<MiniAppCommandEntity> findAllByMiniAppName(@Param("miniAppName") String miniAppName);

}
