package demo.Components.Service;


import demo.Boundaries.Enums.Role;
import demo.Boundaries.Objects.ObjectBoundary;
import demo.Boundaries.User.UserBoundary;
import demo.Boundaries.MiniAppCommand.MiniAppCommandBoundary;
import demo.Components.DB.CommandDB;
import demo.Components.DB.ObjectDB;
import demo.Components.Service.CommandService.DefaultCommand;
import demo.Components.Service.Interfaces.AdminService;
import demo.Components.DB.UsersDB;
import demo.Exceptions.UnauthorizedException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Objects;

@Service
public class AdminServiceImplementation implements AdminService {

    private UsersDB userDB;
    private CommandDB commandDB;
    private ObjectDB objectDB;
    private Log logger = LogFactory.getLog(AdminServiceImplementation.class);

    public AdminServiceImplementation(UsersDB userDB, CommandDB commandDB, ObjectDB objectDB) {
        this.userDB = userDB;
        this.objectDB = objectDB;
        this.commandDB = commandDB;
    }

    @Override
    public Mono<Void> deleteAllUsers(String superapp, String email) {
        logger.trace("AdminServiceImplementation deleteAllUsers begin ");
        return this.userDB
                .findById(email + "_" + superapp)
                .flatMap(user -> {
                    if (!Objects.equals(user.getRole().toString(), Role.ADMIN.toString())){
                        logger.warn("\u001B[32m AdminServiceImplementation deleteAllUsers Only admin users are allowed to access this command\u001B[0m");
                        return Mono.error(() -> new UnauthorizedException("Only admin users are allowed to access this command"));
                    }
                    logger.trace("AdminServiceImplementation deleteAllUsers successfully ");
                    return this.userDB.deleteAll();
                })
                .log()
                .then();

    }

    @Override
    public Mono<Void> deleteAllObjects(String superapp, String email) {
        logger.trace("AdminServiceImplementation deleteAllObjects begin ");
        return this.userDB
                .findById(email + "_" + superapp)
                .flatMap(user -> {
                    if (!Objects.equals(user.getRole().toString(), Role.ADMIN.toString())) {
                        logger.warn("\u001B[32m AdminServiceImplementation deleteAllObjects Only admin users are allowed to access this command\u001B[0m");
                        return Mono.error(() -> new UnauthorizedException("Only admin users are allowed to access this command"));
                    }
                    logger.trace("AdminServiceImplementation deleteAllObjects successfully ");
                    return this.objectDB.deleteAll();
                })
                .log()
                .then();
    }

    @Override
    public Mono<Void> deleteAllCommands(String superapp, String email) {
        logger.trace("AdminServiceImplementation deleteAllCommands begin ");
        return this.userDB
                .findById(email + "_" + superapp)
                .flatMap(user -> {
                    if (!Objects.equals(user.getRole().toString(), Role.ADMIN.toString())) {
                        logger.warn("\u001B[32m AdminServiceImplementation deleteAllCommands Only admin users are allowed to access this command\u001B[0m");
                        return Mono.error(() -> new UnauthorizedException("Only admin users are allowed to access this command"));
                    }
                    logger.trace("AdminServiceImplementation deleteAllCommands successfully ");
                    return this.commandDB.deleteAll();
                })
                .log()
                .then();
    }

    @Override
    public Flux<UserBoundary> getAllUsers(String superapp, String email) {
        logger.trace("AdminServiceImplementation getAllUsers begin ");
        return this.userDB
                .findById(email + "_" + superapp)
                .flatMapMany(user -> {
                    if (!Objects.equals(user.getRole().toString(), Role.ADMIN.toString())) {
                        logger.warn("\u001B[32m AdminServiceImplementation getAllUsers Only admin users are allowed to access this command\u001B[0m");
                        return Mono.error(() -> new UnauthorizedException("Only admin users are allowed to access this command"));
                    }
                    logger.trace("AdminServiceImplementation getAllUsers successfully ");
                    return this.userDB.findAll();

                })
                .map(//UserBoundary::new)
                        entity -> {
                            logger.trace("AdminServiceImplementation getAllUsers UserBoundary successfully");
                            return new UserBoundary(entity);
                        })
                .log();
    }

    @Override
    public Flux<MiniAppCommandBoundary> getAllCommandsHistory(String superapp, String email) {
        logger.trace("AdminServiceImplementation getAllCommandsHistory begin ");
        return this.userDB
                .findById(email + "_" + superapp)
                .flatMapMany(user -> {
                    if (!Objects.equals(user.getRole().toString(), Role.ADMIN.toString())) {
                        logger.warn("\u001B[32m AdminServiceImplementation getAllCommandsHistory Only admin users are allowed to access this command\u001B[0m");
                        return Mono.error(() -> new UnauthorizedException("Only admin users are allowed to access this command"));
                    }
                    logger.trace("AdminServiceImplementation getAllCommandsHistory successfully ");
                    return this.commandDB.findAll();

                })
                .map(//MiniAppCommandBoundary::new)
                        entity -> {
                            logger.trace("AdminServiceImplementation getAllCommandsHistory MiniAppCommandBoundary successfully");
                            return new MiniAppCommandBoundary(entity);
                        })
                .log();
    }

    @Override
    public Flux<MiniAppCommandBoundary> getAllSpecificAppCommandsHistory(String miniAppName, String superapp, String email) {
        logger.trace("AdminServiceImplementation getAllSpecificAppCommandsHistory begin ");
        return this.userDB
                .findById(email + "_" + superapp)
                .flatMapMany(user -> {
                    if (!Objects.equals(user.getRole().toString(), Role.ADMIN.toString())) {
                        logger.warn("\u001B[32m AdminServiceImplementation getAllSpecificAppCommandsHistory Only admin users are allowed to access this command\u001B[0m");
                        return Mono.error(() -> new UnauthorizedException("Only admin users are allowed to access this command"));
                    }
                    logger.trace("AdminServiceImplementation getAllSpecificAppCommandsHistory successfully ");
                    return this.commandDB.findAllByMiniAppName(miniAppName);

                })
                .map(//MiniAppCommandBoundary::new)
                        entity -> {
                            logger.trace("AdminServiceImplementation getAllSpecificAppCommandsHistory MiniAppCommandBoundary successfully");
                            return new MiniAppCommandBoundary(entity);
                        })
                .log();

    }

}
