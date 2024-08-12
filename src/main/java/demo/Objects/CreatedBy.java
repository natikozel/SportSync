package demo.Objects;

public class CreatedBy {
	
	private UserId userId;
	
	public CreatedBy(UserId userId) {
		this.userId = userId;
	}


	public CreatedBy() {}

	public UserId getUserId() {
		return userId;
	}

	public void setUserId(UserId userId) {
		this.userId = userId;
	}

	@Override
	public String toString() {
		return "CreatedBy{" +
				"userId=" + userId +
				'}';
	}
}
