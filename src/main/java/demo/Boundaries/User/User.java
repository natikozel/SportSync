package demo.Boundaries.User;

import demo.Boundaries.Enums.Role;

public abstract class User
{
    private Role role;
    private String username;
    private String avatar;

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public User(Role role, String username, String avatar) {
        this.role = role;
        this.username = username;
        this.avatar = avatar;
    }

    public User() {
    }

    @Override
    public String toString() {
        return "User{" +
                "role=" + role +
                ", userName='" + username + '\'' +
                ", avatar='" + avatar + '\'' +
                '}';
    }
}
