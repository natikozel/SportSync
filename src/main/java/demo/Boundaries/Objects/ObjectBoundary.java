package demo.Boundaries.Objects;

import demo.Documents.ObjectEntity;
import demo.Objects.CreatedBy;
import demo.Objects.ObjectId;


import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class ObjectBoundary {

    private ObjectId objectId;
    private String type;
    private String alias;
    private Boolean active;
    private Date creationTimestamp;
    private CreatedBy createdBy;
    private Map<String, Object> objectDetails;

    public ObjectBoundary() {
    }

    public ObjectBoundary(ObjectId objectId, String type, String alias, CreatedBy createdBy) {
        this.objectId = objectId;
        this.type = type;
        this.alias = alias;
        this.createdBy = createdBy;
    }

    public ObjectBoundary(ObjectId objectId, String type, String alias, CreatedBy createdBy, Map<String, Object> objectDetails) {
        this.objectId = objectId;
        this.type = type;
        this.alias = alias;
        this.createdBy = createdBy;
        this.objectDetails = objectDetails;
    }

    public ObjectBoundary(ObjectEntity objectEntity) {
        String[] splitId = objectEntity.getObjectId().split("_");
        this.objectId = new ObjectId();
        this.objectId.setId(splitId[0]);
        this.objectId.setSuperapp(splitId[1]);
        setObjectDetails(objectEntity.getObjectDetails());
        setActive(objectEntity.getActive());
        setCreationTimestamp(objectEntity.getCreationTimeStamp());
        setCreatedBy(objectEntity.getCreatedBy());
        setType(objectEntity.getType());
        setAlias(objectEntity.getAlias());
    }

    public ObjectId getObjectId() {
        return objectId;
    }

    public void setObjectId(ObjectId objectId) {
        this.objectId = objectId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Date getCreationTimestamp() {
        return creationTimestamp;
    }

    public void setCreationTimestamp(Date creationTimestamp) {
        this.creationTimestamp = creationTimestamp;
    }

    public CreatedBy getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(CreatedBy createdBy) {
        this.createdBy = createdBy;
    }

    public Boolean getActive() {
        return active;
    }

    public Map<String, Object> getObjectDetails() {
        return objectDetails;
    }

    public void setObjectDetails(Map<String, Object> objectDetails) {
        this.objectDetails = objectDetails;
    }

    public ObjectEntity toEntity() {
        ObjectEntity objectEntity = new ObjectEntity();

        objectEntity.setObjectId(this.getObjectId().getId() + "_" + this.getObjectId().getSuperapp());
        objectEntity.setType(this.getType().trim());
        objectEntity.setCreationTimeStamp(this.getCreationTimestamp());
        objectEntity.setCreatedBy(this.getCreatedBy());
        objectEntity.setActive(this.getActive() == null || this.getActive());
        objectEntity.setAlias(this.getAlias().trim());
        objectEntity.setObjectDetails(this.getObjectDetails() == null ? new HashMap<>() : this.getObjectDetails());


        return objectEntity;
    }

    @Override
    public String toString() {
        return "ObjectBoundary{" +
                "objectId=" + objectId +
                ", type='" + type + '\'' +
                ", alias='" + alias + '\'' +
                ", active=" + active +
                ", creationTimeStamp=" + creationTimestamp +
                ", createdBy=" + createdBy +
                ", objectDetails=" + objectDetails +
                '}';
    }
}
