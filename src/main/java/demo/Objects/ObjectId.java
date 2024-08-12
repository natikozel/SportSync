package demo.Objects;

public class ObjectId {
    private String superapp;

    private String id;

    public ObjectId() {
    }

    public void setSuperapp(String superapp) {
        this.superapp = superapp;
    }

    public String getSuperapp() {
        return this.superapp;
    }

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "ObjectId{" +
                "id='" + id + '\'' +
                ", superapp='" + superapp + '\'' +
                '}';
    }
}
