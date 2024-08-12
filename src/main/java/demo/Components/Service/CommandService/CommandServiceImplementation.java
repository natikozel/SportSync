package demo.Components.Service.CommandService;

import demo.Boundaries.Enums.Role;
import demo.Boundaries.MiniAppCommand.MiniAppCommandBoundary;
import demo.Boundaries.Objects.ObjectBoundary;
import demo.Components.DB.ObjectDB;
import demo.Components.DB.UsersDB;
import demo.Components.Service.CommandService.Trainees.TraineeCommand;
import demo.Components.Service.CommandService.Trainers.TrainerCommand;
import demo.Components.Service.CommandService.Trainers.getMyAcceptedRequests;
import demo.Components.Service.Interfaces.CommandService;
import demo.Components.DB.CommandDB;
import demo.Components.Service.Interfaces.ObjectService;
import demo.Components.Service.Interfaces.UsersService;
import demo.Documents.ObjectEntity;
import demo.Documents.UserEntity;
import demo.Exceptions.BadRequestException;
import demo.Exceptions.ForbiddenException;
import demo.Exceptions.UnauthorizedException;
import demo.Objects.CommandId;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Date;
import java.util.Objects;
import java.util.UUID;


@Service
public class CommandServiceImplementation implements CommandService {

    private final CommandDB crud;
    private final UsersDB userDB;
    private final ObjectDB objectDB;
    private final ObjectService objectService;
    private final UsersService userService;
    private final ApplicationContext applicationContext;
    private final Command defaultCommandReference;
    private final Log logger = LogFactory.getLog(CommandServiceImplementation.class);

    @Value("${spring.application.name}")
    private String superAppName;

    public CommandServiceImplementation(CommandDB crud, UsersDB userDB, ObjectDB objectDB, ObjectService objectService, UsersService userService, ApplicationContext applicationContext, @Qualifier("defaultCommand") Command defaultCommandReference) {
        super();
        this.crud = crud;
        this.userDB = userDB;
        this.objectDB = objectDB;
        this.objectService = objectService;
        this.userService = userService;
        this.applicationContext = applicationContext;
        this.defaultCommandReference = defaultCommandReference;
    }

    private void validateUser(UserEntity user) {
        if (!Objects.equals(user.getRole().toString(), Role.MINIAPP_USER.toString())) {
            logger.warn("\u001B[32m validateUser ERROR Only MINIAPP_USER users are allowed to access this command \u001B[0m");
            throw new UnauthorizedException("Only MINIAPP_USER users are allowed to access this command");
        }
    }

    private void validateObject(ObjectEntity object) {
        if (!object.getActive()) {
            logger.warn("\u001B[32m validateObject ERROR Object is not active currently \u001B[0m");
            throw new ForbiddenException("Object is not active currently");
        }
    }

    @Override
    public Flux<Object> invokeCommand(String miniAppName, MiniAppCommandBoundary appCommandBoundary) {
        logger.trace("CommandServiceImplementation invokeCommand" + appCommandBoundary.getCommand());
        return Mono
                .just(appCommandBoundary)
                .flatMap(command -> {
                    if (command.getInvokedBy() == null || command.getInvokedBy().getUserId() == null) {
                        logger.warn("\u001B[32m invokeCommand ERROR InvokedBy can't be null \u001B[0m");
                        return Mono.error(() -> new BadRequestException("InvokedBy can't be null"));
                    }
                    if (command.getCommand() == null || Objects.equals(command.getCommand().trim(), "")) {
                        logger.warn("\u001B[32m invokeCommand ERROR Command can't be null or an empty string! \u001B[0m");
                        return Mono.error(() -> new BadRequestException("Command can't be null or an empty string!"));
                    }
                    if (command.getTargetObject() == null || command.getTargetObject().getObjectId() == null) {
                        logger.warn("\u001B[32m invokeCommand ERROR Target object can't be null! \u001B[0m");
                        return Mono.error(() -> new BadRequestException("Target object can't be null!"));
                    }
                    logger.trace("CommandServiceImplementation invokeCommand" + appCommandBoundary.getCommand() + "successfully");
                    return this.userDB.findById(appCommandBoundary.getInvokedBy().getUserId().getEmail() + "_" + appCommandBoundary.getInvokedBy().getUserId().getSuperapp());
                })
                .switchIfEmpty(Mono.error(() -> new BadRequestException("Command execution failed: Invoked by an unknown user")))
                .flatMap(user -> {
                    try {
                        validateUser(user);
                    } catch (Exception e) {
                        return Mono.error(e);
                    }
                    return this.objectDB.findById(appCommandBoundary.getTargetObject().getObjectId().getId() + "_" + appCommandBoundary.getTargetObject().getObjectId().getSuperapp());
                })
                .switchIfEmpty(Mono.error(() -> new BadRequestException("Command execution failed: Target object is unknown")))
                .flatMap(object -> {
                    try {
                        validateObject(object);
                    } catch (Exception e) {
                        return Mono.error(e);
                    }
                    return Mono.just(appCommandBoundary);
                })
                .flatMap(command -> {

                    command.setCommandId(new CommandId());
                    command.getCommandId().setSuperapp(appCommandBoundary.getTargetObject().getObjectId().getSuperapp());
                    command.getCommandId().setMiniapp(miniAppName);
                    command.getCommandId().setId(UUID.randomUUID().toString());
                    command.setInvocationTimestamp(new Date());

                    return Mono.just(command);

                })
                .map(//MiniAppCommandBoundary::toEntity)
                        c -> {
                            logger.trace("CommandServiceImplementation invokeCommand MiniAppCommandBoundary toEntity successfully");
                            return c.toEntity();
                        })
                .flatMapMany(this.crud::save)
                .flatMap(entity -> invoke(new MiniAppCommandBoundary(entity)))
                .log();

    }

    public Flux<Object> invoke(MiniAppCommandBoundary commandBoundary) {
        String commandName = commandBoundary.getCommand();
        String miniApp = commandBoundary.getCommandId().getMiniapp();
        if (commandName == null || commandName.isEmpty())
            commandName = "defaultCommand";

        Command command;

        try {
            switch (miniApp) {
                case "Trainees" -> command = this.applicationContext.getBean(commandName, TraineeCommand.class);
                case "Trainers" -> command = this.applicationContext.getBean(commandName, TrainerCommand.class);
                default -> throw new BadRequestException("Unknown MiniApp Name");

            }
        } catch (Exception e) {
            if (e instanceof BadRequestException that)
                return Flux.error(() -> that);
            command = this.defaultCommandReference;
        }
        return command.invoke(commandBoundary, objectService, userService, objectDB, userDB);
    }

}

