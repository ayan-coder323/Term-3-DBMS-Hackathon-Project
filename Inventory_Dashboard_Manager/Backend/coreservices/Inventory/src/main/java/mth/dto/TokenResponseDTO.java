package mth.dto;

public class TokenResponseDTO {

    private String accessToken;
    private String tokenType = "bearer";
    private UserResponseDTO user;

    public TokenResponseDTO() {
    }

    public TokenResponseDTO(String accessToken, String tokenType, UserResponseDTO user) {
        this.accessToken = accessToken;
        this.tokenType = tokenType;
        this.user = user;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public UserResponseDTO getUser() {
        return user;
    }

    public void setUser(UserResponseDTO user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "TokenResponseDTO [accessToken=" + accessToken + ", tokenType=" + tokenType + ", user=" + user + "]";
    }
}
