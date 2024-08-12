package demo.Components.Service;

import demo.Boundaries.Enums.Role;
import demo.Boundaries.Objects.ObjectBoundary;
import demo.Components.DB.ObjectDB;
import demo.Components.DB.UsersDB;
import demo.Components.Service.Interfaces.ObjectSearchService;
import demo.Documents.UserEntity;
import demo.Exceptions.BadRequestException;
import demo.Exceptions.UnauthorizedException;
import demo.Objects.ObjectId;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Date;
import java.util.Objects;
import java.util.UUID;

@Service
public class ObjectsServiceImplementation implements ObjectSearchService {

    @Value("${spring.application.name}")
    private String superAppName;
    private final ObjectDB objectDB;
    private final UsersDB userDB;
    private final Log logger = LogFactory.getLog(ObjectsServiceImplementation.class);


    public ObjectsServiceImplementation(ObjectDB objectDB, UsersDB userDB) {
        super();
        this.objectDB = objectDB;
        this.userDB = userDB;
    }

    private void validateSuperAppUser(UserEntity user) {
        if (!Objects.equals(user.getRole().toString(), Role.SUPERAPP_USER.toString())) {
            logger.warn("\u001B[32m validateSuperAppUser ERROR Only SUPERAPP_USER users are allowed to access this command \u001B[0m");
            throw new UnauthorizedException("Only SUPERAPP_USER users are allowed to access this command");
        }
    }

    private void validateUser(UserEntity user) {
        if (!Objects.equals(user.getRole().toString(), Role.SUPERAPP_USER.toString()) && !Objects.equals(user.getRole().toString(), Role.MINIAPP_USER.toString())) {
            logger.warn("\u001B[32m validateUser ERROR Only SUPERAPP_USER and MINIAPP_USER users are allowed to access this command \u001B[0m");
            throw new UnauthorizedException("Only SUPERAPP_USER and MINIAPP_USER users are allowed to access this command");
        }
    }

    private void validateObjectBoundary(ObjectBoundary objectBoundary) {
        logger.trace("ObjectsServiceImplementation validateObjectBoundary" + objectBoundary);
        if (objectBoundary.getCreatedBy() == null || objectBoundary.getCreatedBy().getUserId() == null) {
            logger.warn("\u001B[32m validateObjectBoundary ERROR" + objectBoundary.getCreatedBy() + "CreatedBy can't be null \u001B[0m");
            throw new BadRequestException("CreatedBy can't be null");
        }

        if (objectBoundary.getCreatedBy().getUserId().getEmail() == null || Objects.equals(objectBoundary.getCreatedBy().getUserId().getEmail().trim(), "")) {
            logger.warn("\u001B[32m validateObjectBoundary ERROR" + objectBoundary.getCreatedBy() + "User Email can't be null or an empty string! \u001B[0m");
            throw new BadRequestException("User Email can't be null or an empty string!");
        }

        if (objectBoundary.getCreatedBy().getUserId().getSuperapp() == null || Objects.equals(objectBoundary.getCreatedBy().getUserId().getSuperapp().trim(), "")) {
            logger.warn("\u001B[32m validateObjectBoundary ERROR" + objectBoundary.getCreatedBy() + "User SuperApp can't be null or an empty string! \u001B[0m");
            throw new BadRequestException("User SuperApp can't be null or an empty string!");
        }

        if (objectBoundary.getAlias() == null || Objects.equals(objectBoundary.getAlias().trim(), "")) {
            logger.warn("\u001B[32m validateObjectBoundary ERROR" + objectBoundary.getCreatedBy() + "Object Alias can't be null or an empty string! \u001B[0m");
            throw new BadRequestException("Object Alias can't be null or an empty string!");
        }

        if (objectBoundary.getType() == null || Objects.equals(objectBoundary.getType().trim(), "")) {
            logger.warn("\u001B[32m validateObjectBoundary ERROR" + objectBoundary.getCreatedBy() + "Object Type can't be null or an empty string! \u001B[0m");
            throw new BadRequestException("Object Type can't be null or an empty string!");
        }

//        if (objectBoundary.getObjectId().getId() == null || Objects.equals(objectBoundary.getObjectId().getId().trim(), ""))
//            throw new BadRequestException("Object ID can't be null or an empty string!");
//
//        if (objectBoundary.getObjectId().getSuperapp() == null || Objects.equals(objectBoundary.getObjectId().getSuperapp().trim(), ""))
//            throw new BadRequestException("Object SuperApp can't be null or an empty string!");

    }

    @Override
    public Mono<ObjectBoundary> createNewObject(ObjectBoundary objectBoundary) {
        System.err.println(objectBoundary);
        logger.trace("ObjectsServiceImplementation createNewObject" + objectBoundary + "begin");
        //System.err.println(objectBoundary.getCreatedBy().getUserId().getEmail() + "_" + objectBoundary.getCreatedBy().getUserId().getSuperapp());
        return this.userDB
                .findById(objectBoundary.getCreatedBy().getUserId().getEmail() + "_" + objectBoundary.getCreatedBy().getUserId().getSuperapp())
                .flatMap(user -> {
                    //System.err.println(user);
                    try {
                        validateSuperAppUser(user);
                        validateObjectBoundary(objectBoundary);
                    } catch (Exception e) {
                        return Mono.error(e);
                    }
                    objectBoundary.setObjectId(new ObjectId());
                    objectBoundary.getObjectId().setId(UUID.randomUUID().toString());
                    objectBoundary.getObjectId().setSuperapp(superAppName);
                    objectBoundary.setCreationTimestamp(new Date());
                    return Mono.just(objectBoundary);
                })
                .map(//ObjectBoundary::toEntity)
                        o -> {
                            logger.trace("ObjectsServiceImplementation createNewObject ObjectBoundary toEntity successfully");
                            return o.toEntity();
                        })
                .flatMap(this.objectDB::save)
                .map(//ObjectBoundary::new)
                        entity -> {
                            logger.trace("ObjectsServiceImplementation createNewObject ObjectBoundary successfully");
                            return new ObjectBoundary(entity);
                        })
                .log();

    }

    @Override
    public Mono<Void> updateObject(ObjectBoundary objectBoundary, String id, String userSuperapp, String email, String superapp) {
        logger.trace("ObjectsServiceImplementation updateObject" + objectBoundary + "begin");
        return this.userDB
                .findById(email + "_" + userSuperapp)
                .flatMap(user -> {
                    try {
                        validateSuperAppUser(user);
                    } catch (Exception e) {
                        return Mono.error(e);
                    }

                    return this.objectDB.findById(id + "_" + superapp);
                })
                .flatMap(object -> {
                    if (objectBoundary.getType() != null)
                        object.setType(objectBoundary.getType());
                    if (objectBoundary.getAlias() != null)
                        object.setAlias(objectBoundary.getAlias());
                    if (objectBoundary.getActive() != null)
                        object.setActive(objectBoundary.getActive());
                    if (objectBoundary.getObjectDetails() != null)
                        object.setObjectDetails(objectBoundary.getObjectDetails());

                    return Mono.just(object);
                })
                .flatMap(this.objectDB::save)
                .map(
                        entity -> {
                            logger.trace("ObjectsServiceImplementation updateObject ObjectBoundary successfully");
                            return new ObjectBoundary(entity);
                        })
                .log()
                .then();
    }

    @Override
    public Mono<ObjectBoundary> getObject(String id, String userSuperapp, String email, String superapp) {
        logger.trace("ObjectsServiceImplementation getObject begin");
        return this.userDB
                .findById(email + "_" + userSuperapp)
                .flatMap(user -> {
                    try {
                        validateUser(user);
                    } catch (Exception e) {
                        return Mono.error(e);
                    }
                    if (Objects.equals(user.getRole().toString(), Role.MINIAPP_USER.toString()))
                        return this.objectDB.findByObjectIdAndActiveTrue(id + "_" + superapp);
                    return this.objectDB.findById(id + "_" + superapp);
                })
                .map(//ObjectBoundary::new)
                        entity -> {
                            logger.trace("ObjectsServiceImplementation getObject ObjectBoundary successfully");
                            return new ObjectBoundary(entity);
                        })
                .log();

    }

    @Override
    public Flux<ObjectBoundary> getAllObjects(String superapp, String email) {
        logger.trace("ObjectsServiceImplementation getAllObjects begin");
        return this.userDB
                .findById(email + "_" + superapp)
                .flatMapMany(user -> {
                    try {
                        validateUser(user);
                    } catch (Exception e) {
                        return Mono.error(e);
                    }
                    if (Objects.equals(user.getRole().toString(), Role.MINIAPP_USER.toString()))
                        return this.objectDB.findAllByActiveTrue();
                    return this.objectDB.findAll();
                })
                .map(//ObjectBoundary::new)
                        entity -> {
                            logger.trace("ObjectsServiceImplementation getAllObjects ObjectBoundary successfully");
                            return new ObjectBoundary(entity);
                        })
                .log();
    }

    @Override
    public Flux<ObjectBoundary> searchByType(String type, String superapp, String email) {
        logger.trace("ObjectsServiceImplementation searchByType" + type + "begin");
        return this.userDB
                .findById(email + "_" + superapp)
                .flatMapMany(user -> {
                    try {
                        validateUser(user);
                    } catch (Exception e) {
                        return Mono.error(e);
                    }
                    if (Objects.equals(user.getRole().toString(), Role.MINIAPP_USER.toString()))
                        return this.objectDB.findAllByTypeAndActiveTrue(type);
                    return this.objectDB.findAllByType(type);
                })
                .map(//ObjectBoundary::new)
                        entity -> {
                            logger.trace("ObjectsServiceImplementation searchByType ObjectBoundary successfully");
                            return new ObjectBoundary(entity);
                        })
                .log();
    }

    @Override
    public Flux<ObjectBoundary> searchByAlias(String alias, String superapp, String email) {
        logger.trace("ObjectsServiceImplementation searchByAlias" + alias + "begin");
        return this.userDB
                .findById(email + "_" + superapp)
                .flatMapMany(user -> {
                    try {
                        validateUser(user);
                    } catch (Exception e) {
                        return Mono.error(e);
                    }
                    if (Objects.equals(user.getRole().toString(), Role.MINIAPP_USER.toString()))
                        return this.objectDB.findAllByAliasAndActiveTrue(alias);
                    return this.objectDB.findAllByAlias(alias);
                })
                .map(//ObjectBoundary::new)
                        entity -> {
                            logger.trace("ObjectsServiceImplementation searchByAlias ObjectBoundary successfully");
                            return new ObjectBoundary(entity);
                        })
                .log();
    }

    @Override
    public Flux<ObjectBoundary> searchByAliasPattern(String pattern, String superapp, String email) {
        logger.trace("ObjectsServiceImplementation searchByAlias" + pattern + "begin");
        return this.userDB
                .findById(email + "_" + superapp)
                .flatMapMany(user -> {
                    try {
                        validateUser(user);
                    } catch (Exception e) {
                        return Mono.error(e);
                    }
                    if (Objects.equals(user.getRole().toString(), Role.MINIAPP_USER.toString()))
                        return this.objectDB.findAllByAliasContainingAndActiveTrue(pattern);
                    return this.objectDB.findAllByAliasContaining(pattern);
                })
                .map(//ObjectBoundary::new)
                        entity -> {
                            logger.trace("ObjectsServiceImplementation searchByAliasPattern ObjectBoundary successfully");
                            return new ObjectBoundary(entity);
                        })
                .log();
    }
}
