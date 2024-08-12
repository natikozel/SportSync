package demo.Boundaries.User;

import demo.Boundaries.Enums.Role;
import demo.Documents.UserEntity;
import demo.Objects.UserId;

public class UserBoundary extends User {


    private UserId userId;


    public UserBoundary(UserEntity userEntity) {
        super(userEntity.getRole(), userEntity.getUserName(), userEntity.getAvatar());
        this.userId = new UserId();
        String[] splitId = userEntity.getId().split("_");
        this.getUserId().setEmail(splitId[0]);
        this.getUserId().setSuperapp(splitId[1]);


    }

    public UserBoundary(Role role, String username, String avatar, UserId userId) {
        super(role, username, avatar);
        this.userId = userId;
    }

    public UserBoundary() {
        super();
    }

    public UserBoundary(Role role, String username, String avatar) {
        super(role, username, avatar);
    }

    public UserId getUserId() {
        return userId;
    }

    public void setUserId(UserId userId) {
        this.userId = userId;
    }


    @Override
    public String toString() {
        return "UserBoundary{" +
                "userId=" + userId + super.toString() +
                '}';
    }
}
