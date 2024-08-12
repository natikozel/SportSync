package demo.Boundaries.User;

import demo.Boundaries.Enums.Role;
import demo.Documents.UserEntity;

public class NewUserBoundary extends User {

    private String email;


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public NewUserBoundary() {
        super();
    }

    public NewUserBoundary(Role role, String username, String avatar, String email) {
        super(role, username, avatar);
        this.email = email;
    }

    public UserEntity toEntity() {
        UserEntity entity = new UserEntity();

        entity.setId(this.getEmail().trim());
        entity.setRole(this.getRole());
        entity.setUserName(this.getUsername().trim());
        entity.setAvatar(this.getAvatar().trim());

        return entity;

    }

    @Override
    public String toString() {
        return "NewUserBoundary{" +
                "email='" + email + '\'' + super.toString() +
                '}';
    }

}

