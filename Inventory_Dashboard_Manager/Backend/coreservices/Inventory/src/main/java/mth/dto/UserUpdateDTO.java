package mth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UserUpdateDTO {

    @NotBlank(message = "Role is required")
    private String role;

    @NotNull(message = "Active status is required")
    @JsonProperty("isActive")
    private Integer isActive;

    public UserUpdateDTO() {
    }

    public UserUpdateDTO(String role, Integer isActive) {
        this.role = role;
        this.isActive = isActive;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Integer getIsActive() {
        return isActive;
    }

    public void setIsActive(Integer isActive) {
        this.isActive = isActive;
    }

    @Override
    public String toString() {
        return "UserUpdateDTO [role=" + role + ", isActive=" + isActive + "]";
    }
}

