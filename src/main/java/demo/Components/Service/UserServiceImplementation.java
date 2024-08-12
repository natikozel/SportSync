package demo.Components.Service;

import demo.Boundaries.Enums.Role;
import demo.Boundaries.Objects.ObjectBoundary;
import demo.Boundaries.User.NewUserBoundary;
import demo.Boundaries.User.User;
import demo.Boundaries.User.UserBoundary;
import demo.Components.DB.UsersDB;
import demo.Components.Service.Interfaces.UsersService;
import demo.Documents.UserEntity;
import demo.Exceptions.BadRequestException;
import demo.Exceptions.ForbiddenException;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Objects;


@Service
public class UserServiceImplementation implements UsersService {

    @Value("${spring.application.name:superappdemo}")
    private String springApplicationName;
    private final UsersDB usersDB;
    private final Log logger = LogFactory.getLog(UserServiceImplementation.class);

    public UserServiceImplementation(UsersDB users) {
        super();
        this.usersDB = users;
    }

    public void validateUserBoundary(User user, boolean isEditing) {
        logger.trace("UserServiceImplementation validateUserBoundary begin");
        if (user instanceof NewUserBoundary that) {
            if (that.getEmail() == null || Objects.equals(that.getEmail().trim(), "")) {
                logger.warn("\u001B[32m validateUserBoundary ERROR Email is required \u001B[0m");
                throw new BadRequestException("Email is required");
            }

            if (!that.getEmail().contains("@")) {
                logger.warn("\u001B[32m validateUserBoundary ERROR Email input must be an email address \u001B[0m");
                throw new BadRequestException("Email input must be an email address");
            }
        }

        if (!Objects.equals(user.getRole().toString(), Role.ADMIN.toString()) &&
                !Objects.equals(user.getRole().toString(), Role.MINIAPP_USER.toString()) &&
                !Objects.equals(user.getRole().toString(), Role.SUPERAPP_USER.toString())) {
            logger.warn("\u001B[32m validateUserBoundary ERROR Role must be an existing role \u001B[0m");
            throw new BadRequestException("Role must be an existing role");
        }

        if (!isEditing) {
            if (user.getRole() == null) {
                logger.warn("\u001B[32m validateUserBoundary ERROR Role must be specified \u001B[0m");
                throw new BadRequestException("Role must be specified");
            }

            if (user.getAvatar() == null || Objects.equals(user.getAvatar().trim(), "")) {
                logger.warn("\u001B[32m validateUserBoundary ERROR Avatar can't be null or an empty string! \u001B[0m");
                throw new BadRequestException("Avatar can't be null or an empty string!");
            }

            if (user.getUsername() == null || Objects.equals(user.getUsername().trim(), "")) {
                logger.warn("\u001B[32m validateUserBoundary ERROR Username can't be null or an empty string! \u001B[0m");
                throw new BadRequestException("Username can't be null or an empty string!");
            }
        }
    }

    @Override
    public Mono<UserBoundary> createNewUser(NewUserBoundary userBoundary) {
        logger.trace("UserServiceImplementation createNewUser" + userBoundary + "begin");
        return this.usersDB
                .existsById(userBoundary.getEmail() + "_" + springApplicationName)
                .flatMap(exists -> {
                    if (exists) {
                        logger.warn("\u001B[32m createNewUser ERROR User already exists \u001B[0m");
                        return Mono.error(() -> new BadRequestException("User already exists"));
                    } else
                        return Mono.just(userBoundary);
                })
                .flatMap(user -> {
                    try {
                        validateUserBoundary(user, false);
                    } catch (Exception e) {
                        return Mono.error(e);
                    }
                    user.setEmail(user.getEmail() + "_" + springApplicationName);
                    return Mono.just(user);
                })
                .map(
                        u -> {
                            logger.trace("UserServiceImplementation createNewUser NewUserBoundary toEntity successfully");
                            return u.toEntity();
                        })
                .flatMap(this.usersDB::save)
                .map(//UserBoundary::new)
                        entity -> {
                            logger.trace("UserServiceImplementation createNewUser UserBoundary successfully");
                            return new UserBoundary(entity);
                        })
                .log();
    }

    @Override
    public Mono<UserBoundary> login(String email, String superapp) {
        logger.trace("UserServiceImplementation login begin");
        return this.usersDB
                .findById(email + "_" + superapp)
                .map(
                        entity -> {
                            logger.trace("UserServiceImplementation login UserBoundary successfully");
                            return new UserBoundary(entity);
                        })
                .log();

    }

    @Override
    public Mono<Void> update(String email, UserBoundary userBoundary, String superapp) {
        logger.trace("UserServiceImplementation update" + userBoundary + "begin");
        return Mono
                .just(email + "_" + superapp)
                .flatMap(id -> {
                    try {
                        validateUserBoundary(userBoundary, true);
                    } catch (Exception e) {
                        return Mono.error(e);
                    }
                    return this.usersDB.findById(id);
                })
                .map(user -> {
                    if (userBoundary.getUsername() != null && !Objects.equals(userBoundary.getUsername().trim(), ""))
                        user.setUserName(userBoundary.getUsername());

                    if (    Objects.equals(userBoundary.getRole().toString(), Role.ADMIN.toString()) ||
                            Objects.equals(userBoundary.getRole().toString(), Role.MINIAPP_USER.toString()) ||
                            Objects.equals(userBoundary.getRole().toString(), Role.SUPERAPP_USER.toString()))
                        user.setRole(userBoundary.getRole());
                    if (userBoundary.getAvatar() != null && !Objects.equals(userBoundary.getAvatar().trim(), ""))
                        user.setAvatar(userBoundary.getAvatar());
                    return user;
                })
                .flatMap(this.usersDB::save)
                .map(
                        entity -> {
                            logger.trace("UserServiceImplementation update UserBoundary successfully");
                            return new UserBoundary(entity);
                        })
                .log()
                .then();
    }
}
