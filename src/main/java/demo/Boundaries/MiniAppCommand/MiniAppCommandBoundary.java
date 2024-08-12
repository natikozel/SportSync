package demo.Boundaries.MiniAppCommand;

import java.util.Date;
import java.util.Map;

import demo.Documents.MiniAppCommandEntity;
import demo.Objects.CommandId;
import demo.Objects.CreatedBy;
import demo.Objects.TargetObject;

public class MiniAppCommandBoundary {
    private CommandId commandId;
    private String command;
    private TargetObject targetObject;
    private Date invocationTimestamp;
    private CreatedBy invokedBy;
    private Map<String, Object> commandAttributes;

    public MiniAppCommandBoundary() {
    }

    public MiniAppCommandBoundary(CommandId commandId, String command, TargetObject targetObject, CreatedBy invokedBy) {
        this.commandId = commandId;
        this.command = command;
        this.targetObject = targetObject;
        this.invokedBy = invokedBy;
    }

    public MiniAppCommandBoundary(MiniAppCommandEntity entity) {
        String[] splitId = entity.getCommandId().split("_");
        this.commandId = new CommandId();
        this.getCommandId().setSuperapp(splitId[0]);
        this.getCommandId().setMiniapp(splitId[1]);
        this.getCommandId().setId(splitId[2]);
        this.setCommand(entity.getCommand());
        this.setTargetObject(entity.getTargetObject());
        this.setInvocationTimestamp(entity.getInvocationTimeStamp());
        this.setInvokedBy(entity.getInvokedBy());
        this.setCommandAttributes(entity.getCommandAttributes());
    }

    public MiniAppCommandEntity toEntity() {
        MiniAppCommandEntity entity = new MiniAppCommandEntity();
        entity.setCommand(this.getCommand().trim());
        entity.setCommandId(this.getCommandId().getSuperapp() + "_" + this.getCommandId().getMiniapp() + "_" + this.getCommandId().getId());
        entity.setMiniAppName(this.getCommandId().getMiniapp().trim());
        entity.setTargetObject(this.getTargetObject());
        entity.setCommandAttributes(this.getCommandAttributes());
        entity.setInvokedBy(this.getInvokedBy());
        entity.setInvocationTimeStamp(this.getInvocationTimestamp());
        return entity;
    }

    public CommandId getCommandId() {
        return commandId;
    }


    public void setCommandId(CommandId commandId) {
        this.commandId = commandId;
    }


    public String getCommand() {
        return command;
    }


    public void setCommand(String command) {
        this.command = command;
    }


    public TargetObject getTargetObject() {
        return targetObject;
    }


    public void setTargetObject(TargetObject targetObject) {
        this.targetObject = targetObject;
    }


    public Date getInvocationTimestamp() {
        return invocationTimestamp;
    }


    public void setInvocationTimestamp(Date invocationTimestamp) {
        this.invocationTimestamp = invocationTimestamp;
    }


    public CreatedBy getInvokedBy() {
        return invokedBy;
    }


    public void setInvokedBy(CreatedBy invokedBy) {
        this.invokedBy = invokedBy;
    }


    public Map<String, Object> getCommandAttributes() {
        return commandAttributes;
    }


    public void setCommandAttributes(Map<String, Object> commandAttributes) {
        this.commandAttributes = commandAttributes;
    }


    @Override
    public String toString() {
        return "MiniAppCommandBoundary{" +
                "commandId=" + commandId +
                ", command='" + command + '\'' +
                ", targetObject=" + targetObject +
                ", invocationTimeStamp=" + invocationTimestamp +
                ", invokedBy=" + invokedBy +
                ", commandAttributes=" + commandAttributes +
                '}';
    }
}
