package demo;

import demo.Boundaries.Enums.Role;
import demo.Boundaries.MiniAppCommand.MiniAppCommandBoundary;
import demo.Boundaries.Objects.ObjectBoundary;
import demo.Boundaries.User.NewUserBoundary;
import demo.Boundaries.User.UserBoundary;
import demo.Exceptions.BadRequestException;
import demo.Objects.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException.BadRequest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class ServiceTests {

    private final String url = "http://localhost:8085/superapp";
    private WebClient webClient;
    private List<UserBoundary> testUsersList = new ArrayList<>();
    private UserBoundary ADMIN = new UserBoundary();
    private UserBoundary SUPERAPP_USER = new UserBoundary();
    private UserBoundary MINIAPP_USER = new UserBoundary();

    @BeforeEach
    public void setUp() throws Exception {
        this.webClient = WebClient.create(this.url);
        this.testUsersList = getEachUser();
        this.ADMIN = testUsersList.get(2);
        this.SUPERAPP_USER = testUsersList.get(1);
        this.MINIAPP_USER = testUsersList.get(0);
    }

    @AfterEach
    public void cleanup() {


        //  delete all commands history
        this.webClient
                .delete()
                .uri("/admin/miniapp?userSuperapp={userSuperapp}&userEmail={userEmail}", this.ADMIN.getUserId().getSuperapp(), this.ADMIN.getUserId().getEmail())
                .retrieve()
                .bodyToMono(Void.class)
                .block();

        // delete all objects history
        this.webClient
                .delete()
                .uri("/admin/objects?userSuperapp={userSuperapp}&userEmail={userEmail}", this.ADMIN.getUserId().getSuperapp(), this.ADMIN.getUserId().getEmail())
                .retrieve()
                .bodyToMono(Void.class)
                .block();

        // delete all users
        this.webClient
                .delete()
                .uri("/admin/users?userSuperapp={userSuperapp}&userEmail={userEmail}", this.ADMIN.getUserId().getSuperapp(), this.ADMIN.getUserId().getEmail())
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }


    // Helper function
    public List<UserBoundary> getEachUser() throws Exception {

        // miniapp user
        List<UserBoundary> allUsers = new ArrayList<UserBoundary>();
        allUsers.add(this.webClient
                .post()
                .uri("/users")
                .bodyValue(new NewUserBoundary(Role.MINIAPP_USER, "a", "a", "a@gmail.com"))
                .retrieve()
                .bodyToMono(UserBoundary.class)
                .block());

        // superapp user
        allUsers.add(this.webClient
                .post()
                .uri("/users")
                .bodyValue(new NewUserBoundary(Role.SUPERAPP_USER, "b", "b", "b@gmail.com"))
                .retrieve()
                .bodyToMono(UserBoundary.class)
                .block());


        // admin user
        allUsers.add(this.webClient
                .post()
                .uri("/users")
                .bodyValue(new NewUserBoundary(Role.ADMIN, "c", "c", "c@gmail.com"))
                .retrieve()
                .bodyToMono(UserBoundary.class)
                .block());

        return allUsers;
    }

    // Helper function
    public ObjectBoundary getRandomObject() throws Exception {
        return this.webClient
                .post()
                .uri("/objects")
                .bodyValue(new ObjectBoundary(new ObjectId(), "string", "alias", new CreatedBy(SUPERAPP_USER.getUserId())))
                .retrieve()
                .bodyToMono(ObjectBoundary.class)
                .block();
    }

    // Helper function
    public Object invokeCommand(String command, ObjectBoundary object, String miniapp) throws Exception {
        return this.webClient
                .post()
                .uri("/miniapp/{miniAppName}", miniapp)
                .bodyValue(new MiniAppCommandBoundary(new CommandId(), command, new TargetObject(object.getObjectId()), new CreatedBy(MINIAPP_USER.getUserId())))
                .retrieve()
                .bodyToMono(Object.class)
                .block();
    }


    @Test
    public void testPostNewUserAndLogin() throws Exception {
        // given the server is up
        // when a new user is created
        // then the server stores the user in the database and the user is able to log in

        // my user
        NewUserBoundary user = new NewUserBoundary(Role.MINIAPP_USER, "testName", "testAvatar", "test@gmail.com");

        // post and save in db
        UserBoundary actualUserStoredInDatabase =
                this.webClient
                        .post()
                        .uri("/users")
                        .bodyValue(user)
                        .retrieve()
                        .bodyToMono(UserBoundary.class)
                        .block();

        assert actualUserStoredInDatabase != null;

        // try to log in and find user from within the database
        assertThat(this.webClient
                .get()
                .uri("/users/login/{superapp}/{email}", actualUserStoredInDatabase.getUserId().getSuperapp(), actualUserStoredInDatabase.getUserId().getEmail())
                .retrieve()
                .bodyToMono(UserBoundary.class)
                .block())
                .extracting("username", "avatar")
                .containsExactly("testName", "testAvatar");

    }

    @Test
    public void testUserUpdate() throws Exception {
        // given the server is up and a user exists
        // when a user is updating his details
        // then the server processes his request and updates the details in the database


        // update details
        this.MINIAPP_USER.setAvatar("editedAvatar");
        this.MINIAPP_USER.setUsername("editedUsername");
        this.MINIAPP_USER.setRole(Role.SUPERAPP_USER);

        // send the updated details to the server
        this.webClient
                .put()
                .uri("/users/{superapp}/{email}", this.MINIAPP_USER.getUserId().getSuperapp(), this.MINIAPP_USER.getUserId().getEmail())
                .bodyValue(this.MINIAPP_USER)
                .retrieve()
                .bodyToMono(Void.class)
                .block();

        // check if update is processed
        assertThat(this.webClient
                .get()
                .uri("/users/login/{superapp}/{email}", this.MINIAPP_USER.getUserId().getSuperapp(), this.MINIAPP_USER.getUserId().getEmail())
                .retrieve()
                .bodyToMono(UserBoundary.class)
                .block())
                .extracting("avatar", "username", "role")
                .containsExactly("editedAvatar", "editedUsername", Role.SUPERAPP_USER);


    }

    @Test
    public void testInvokeCommand() throws Exception {
        // given the server is up and the database has an object and a miniapp user
        // when a miniapp user invokes a command on a miniapp
        // then the command is invoked and is saved in the database history

        // random object exists
        ObjectBoundary randomObject = getRandomObject();

        // miniapp user invokes command on that object
        Object firstCommand = invokeCommand("getUserRequests", randomObject, "Trainees");

        // fetch with admin and see if this command was actually invoked and store in the database
        assertThat(this.webClient
                .get()
                .uri("/admin/miniapp?userSuperapp={superapp}&userEmail={email}", this.ADMIN.getUserId().getSuperapp(), this.ADMIN.getUserId().getEmail())
                .retrieve()
                .bodyToFlux(MiniAppCommandBoundary.class)
                .collectList()
                .block())
                .extracting("command")
                .containsExactly("getUserRequests");

    }

    @Test
    public void testInvokeCommandToBadMiniappName() throws Exception {
        // given the server is up and the database has an object and a miniapp user
        // when a miniapp user invokes a command on a miniapp that doesn't exist
        // then the server will return a bad request exception with error 400

        // random object exists
        ObjectBoundary randomObject = getRandomObject();

        // miniapp user invokes command on that object and expects to get a bad request with error 400

        assertThatThrownBy(() -> {
            BadRequest myException = catchThrowableOfType(() ->
                    this.webClient
                            .post()
                            .uri("/miniapp/{miniAppName}", "wrongMiniApp")
                            .bodyValue(new MiniAppCommandBoundary(new CommandId(), "getUserRequests", new TargetObject(randomObject.getObjectId()), new CreatedBy(MINIAPP_USER.getUserId())))
                            .retrieve()
                            .bodyToMono(BadRequestException.class)
                            .block(), BadRequest.class);

            assertThat(myException
                    .getResponseBodyAsString())
                    .contains("Unknown MiniApp Name");


            throw myException;
        })
                .extracting("statusCode")
                .isEqualTo(HttpStatus.BAD_REQUEST);

    }

    @Test
    public void testAdminGetAllUsers() throws Exception {
        // given the server is up and the database has users in it
        // when an admin fetches all users
        // then the admin gets all fetched users


        // 3 users are created beforehand through the @Before notation
        // fetch all Users and compare

        assertThat(this.webClient
                .get()
                .uri("/admin/users?userSuperapp={superapp}&userEmail={email}", this.ADMIN.getUserId().getSuperapp(), this.ADMIN.getUserId().getEmail())
                .retrieve()
                .bodyToFlux(UserBoundary.class)
                .collectList()
                .block())
                .usingRecursiveFieldByFieldElementComparator()
                .containsExactlyInAnyOrderElementsOf(this.testUsersList);


    }

    @Test
    public void testAdminGetAllCommands() throws Exception {
        // given the server is up, an object exists and a miniapp user has invoked a command on that object
        // when an admin fetches all commands history
        // then the admin gets all fetched commands history


        // random object exists
        ObjectBoundary randomObject = getRandomObject();

        // miniapp user invokes two command on that object
        List<Object> allCommands = new ArrayList<>();
        Object firstCommand = invokeCommand("getUserRequests", randomObject, "Trainees");
        Object secondCommand = invokeCommand("getMyPendingRequests", randomObject, "Trainers");
        allCommands.add(firstCommand);
        allCommands.add(secondCommand);


        // fetch all commands and find the stored commands

        assertThat(this.webClient
                .get()
                .uri("/admin/miniapp?userSuperapp={superapp}&userEmail={email}", this.ADMIN.getUserId().getSuperapp(), this.ADMIN.getUserId().getEmail())
                .retrieve()
                .bodyToFlux(MiniAppCommandBoundary.class)
                .collectList()
                .block())
                .extracting("command")
                .hasSize(allCommands.toArray().length)
                .containsExactly("getUserRequests", "getMyPendingRequests");

    }

    @Test
    public void testAdminGetAllSpecificMiniAppCommands() throws Exception {

        // given the server is up and a miniapp user has invoked a command into a specific miniapp
        // when an admin fetches all specific miniapp commands history
        // then the admin gets all fetched specific miniapp commands history


        // random object exists
        ObjectBoundary randomObject = getRandomObject();

        // miniapp user invokes three command on that object and 2 of them belongs to the same miniapp

        List<Object> allCommands = new ArrayList<>();
        Object firstCommand = invokeCommand("getMyAcceptedRequests", randomObject, "Trainers");
        Object secondCommand = invokeCommand("getMyPendingRequests", randomObject, "Trainers");
        Object thirdCommand = invokeCommand("getUserRequests", randomObject, "Trainees");
        allCommands.add(firstCommand);
        allCommands.add(secondCommand);
        allCommands.add(thirdCommand);

        // fetch all commands and find the stored commands

        assertThat(this.webClient
                .get()
                .uri("/admin/miniapp/{miniAppName}?userSuperapp={superapp}&userEmail={email}", "Trainers", this.ADMIN.getUserId().getSuperapp(), this.ADMIN.getUserId().getEmail())
                .retrieve()
                .bodyToFlux(MiniAppCommandBoundary.class)
                .collectList()
                .block())
                .extracting("command")
                .hasSize(2)
                .containsExactly("getMyAcceptedRequests", "getMyPendingRequests")
                .doesNotContain("getUserRequests");

    }


    @Test
    public void testUserLogin() throws Exception {

        // given the user login with valid information
        // when the server get request from the client
        // then the server checks validation and sends back a response with user details
        assertThat(this.webClient
                .get()
                .uri("/users/login/{superapp}/{email}", this.MINIAPP_USER.getUserId().getSuperapp(), this.MINIAPP_USER.getUserId().getEmail())
                .retrieve()
                .bodyToMono(UserBoundary.class)
                .block())
                .extracting("userId.email", "role", "username", "avatar")
                .containsExactly(this.MINIAPP_USER.getUserId().getEmail(), Role.MINIAPP_USER, "a", "a");
    }

    @Test
    public void testPostUserWithInvalidEmail() {
        // given the server is up
        // when a user provides an invalid email during registration
        // then the server throws a specific error regarding the bad input to the user with statuscode 400

        // EMAIL IS INVALID (NOT OF TYPE EMAIL)
        assertThatThrownBy(() -> {
            BadRequest incorrectEmailException = catchThrowableOfType(() -> this.webClient
                    .post()
                    .uri("/users")
                    .bodyValue(new NewUserBoundary(Role.MINIAPP_USER, "correctUserName", "correctAvatar", "email"))
                    .retrieve()
                    .bodyToMono(BadRequestException.class)
                    .block(), BadRequest.class);
            assertThat(incorrectEmailException
                    .getResponseBodyAsString())
                    .contains("Email input must be an email address");
            throw incorrectEmailException;
        })
                .extracting("statusCode")
                .isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void testPostUserWithNullEmail() {
        // given the server is up
        // when a user provides a null email during registration
        // then the server throws a specific error regarding the bad input to the user with statuscode 400

        // NULL EMAIL
        assertThatThrownBy(() -> {
            BadRequest emailException = catchThrowableOfType(() -> this.webClient
                    .post()
                    .uri("/users")
                    .bodyValue(new NewUserBoundary(Role.MINIAPP_USER, "correctUserName", "correctAvatar", ""))
                    .retrieve()
                    .bodyToMono(BadRequestException.class)
                    .block(), BadRequest.class);
            assertThat(emailException
                    .getResponseBodyAsString())
                    .contains("Email is required");
            throw emailException;
        })
                .extracting("statusCode")
                .isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void testPostUserWithNullAvatar() {
        // given the server is up
        // when a user provides a null avatar during registration
        // then the server throws a specific error regarding the bad input to the user with statuscode 400

        // NULL AVATAR
        assertThatThrownBy(() -> {
            BadRequest avatarException = catchThrowableOfType(() -> this.webClient
                    .post()
                    .uri("/users")
                    .bodyValue(new NewUserBoundary(Role.MINIAPP_USER, "correctUserName", "", "correct@gmail.com"))
                    .retrieve()
                    .bodyToMono(BadRequestException.class)
                    .block(), BadRequest.class);
            assertThat(avatarException
                    .getResponseBodyAsString())
                    .contains("Avatar can't be null or an empty string!");
            throw avatarException;
        })
                .extracting("statusCode")
                .isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void testPostUserWithNullUserName() {
        // given the server is up
        // when a user provides a null username during registration
        // then the server throws a specific error regarding the bad input to the user with statuscode 400

        // NULL USERNAME
        assertThatThrownBy(() -> {
            BadRequest userNameException = catchThrowableOfType(() -> this.webClient
                    .post()
                    .uri("/users")
                    .bodyValue(new NewUserBoundary(Role.MINIAPP_USER, "", "correctAvatar", "correct@gmail.com"))
                    .retrieve()
                    .bodyToMono(BadRequestException.class)
                    .block(), BadRequest.class);
            assertThat(userNameException
                    .getResponseBodyAsString())
                    .contains("Username can't be null or an empty string!");
            throw userNameException;
        })
                .extracting("statusCode")
                .isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void testEmailAlreadyUsed() throws Exception {
        // given the server is up and a user exists with the same email
        // when a user attempts to register with a duplicate email
        // then the server notifies the user and prevents the registration with that email address

        assertThatThrownBy(() -> {
            BadRequest emailAlreadyUsedException = catchThrowableOfType(() -> this.webClient
                    .post()
                    .uri("/users")
                    .bodyValue(new NewUserBoundary(Role.MINIAPP_USER, "correctUserName", "correctAvatar", "a@gmail.com"))
                    .retrieve()
                    .bodyToMono(BadRequestException.class)
                    .block(), BadRequest.class);
            assertThat(emailAlreadyUsedException
                    .getResponseBodyAsString())
                    .contains("User already exists");
            throw emailAlreadyUsedException;
        })
                .extracting("statusCode")
                .isEqualTo(HttpStatus.BAD_REQUEST);
    }


    @Test
    public void testPostReview() {
        // given the trainee is logged in and accessing the review section
        // when the trainee writes a review and submits it
        // then the system updates the Trainer's review base


        // trainee initially has to be a superapp user to submit a review
        UserBoundary trainee = this.webClient
                .post()
                .uri("/users")
                .bodyValue(new NewUserBoundary(Role.SUPERAPP_USER, "Trainee", "Te", "Trainee@gmail.com"))
                .retrieve()
                .bodyToMono(UserBoundary.class)
                .block();

        UserBoundary trainer = this.webClient
                .post()
                .uri("/users")
                .bodyValue(new NewUserBoundary(Role.SUPERAPP_USER, "Trainer", "Tr", "Trainer@gmail.com"))
                .retrieve()
                .bodyToMono(UserBoundary.class)
                .block();

        assert trainer != null;
        assert trainee != null;

        ObjectBoundary trainerDetails = this.webClient
                .post()
                .uri("/objects")
                .bodyValue(new ObjectBoundary(new ObjectId(), "Trainer", trainer.getUserId().getEmail(), new CreatedBy(trainer.getUserId())))
                .retrieve()
                .bodyToMono(ObjectBoundary.class)
                .block();

        assert trainerDetails != null;

        // the trainee submits a review about a trainer

        this.webClient
                .post()
                .uri("/objects")
                .bodyValue(new ObjectBoundary(new ObjectId(), "Review", trainer.getUserId().getEmail(), new CreatedBy(trainee.getUserId()), Map.ofEntries(entry("reviewData", "Great Trainer!"))))
                .retrieve()
                .bodyToMono(ObjectBoundary.class)
                .block();

        // review is saved in the database
        // trainer uses a command (has to be a miniapp user) to extract his review list

        this.webClient
                .put()
                .uri("/users/{superapp}/{userEmail}", trainer.getUserId().getSuperapp(), trainer.getUserId().getEmail())
                .bodyValue(new UserBoundary(Role.MINIAPP_USER, trainer.getUsername(), trainer.getAvatar(), trainer.getUserId()))
                .retrieve()
                .bodyToMono(UserBoundary.class)
                .block();

        assertThat(this.webClient
                .post()
                .uri("/miniapp/Trainers")
                .bodyValue(new MiniAppCommandBoundary(new CommandId(), "getReviewsOnMe", new TargetObject(trainerDetails.getObjectId()), new CreatedBy(trainer.getUserId())))
                .retrieve()
                .bodyToFlux(Object.class)
                .collectList()
                .block())
                .extracting("objectDetails")
                .extracting("reviewData")
                .containsExactly("Great Trainer!");
    }

    @Test
    public void testPutObjectDetails() {
        // given trainer details in the database
        // when the trainer edits bio details
        // then the system updates the trainer's details with the new information

        UserBoundary trainer = this.webClient
                .post()
                .uri("/users")
                .bodyValue(new NewUserBoundary(Role.SUPERAPP_USER, "Trainer", "Tr", "Trainer@gmail.com"))
                .retrieve()
                .bodyToMono(UserBoundary.class)
                .block();

        assert trainer != null;

        ObjectBoundary trainerDetails = this.webClient
                .post()
                .uri("/objects")
                .bodyValue(new ObjectBoundary(new ObjectId(), "Trainer", trainer.getUserId().getEmail(), new CreatedBy(trainer.getUserId()), Map.ofEntries(entry("Location", "Tel-Aviv"))))
                .retrieve()
                .bodyToMono(ObjectBoundary.class)
                .block();


        assert trainerDetails != null;
        this.webClient
                .put()
                .uri("/objects/{superapp}/{id}?userSuperapp={userSuperApp}&userEmail={userEmail}", trainer.getUserId().getSuperapp(), trainerDetails.getObjectId().getId(),trainer.getUserId().getSuperapp(), trainer.getUserId().getEmail())
                .bodyValue(new ObjectBoundary(new ObjectId(), "Trainer", trainer.getUserId().getEmail(), new CreatedBy(trainer.getUserId()), Map.ofEntries(entry("Location", "Rishon-Lezion"))))
                .retrieve()
                .bodyToMono(Object.class)
                .block();


        assertThat(this.webClient
                .get()
                .uri("/objects/{superapp}/{id}?userSuperapp={userSuperApp}&userEmail={userEmail}", trainer.getUserId().getSuperapp(), trainerDetails.getObjectId().getId(),trainer.getUserId().getSuperapp(), trainer.getUserId().getEmail())
                .retrieve()
                .bodyToMono(Object.class)
                .block())
                .extracting("objectDetails")
                .extracting("Location")
                .isEqualTo("Rishon-Lezion");
    }

}
