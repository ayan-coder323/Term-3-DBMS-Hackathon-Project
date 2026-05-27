package mth.dto;

import java.time.LocalDateTime;

public class ApiResponseDTO<T> {
    private String status;
    private int code;
    private String message;
    private T data;
    private String timestamp = LocalDateTime.now().toString();

    public ApiResponseDTO() {
    }

    public ApiResponseDTO(String status, int code, String message, T data, String timestamp) {
        this.status = status;
        this.code = code;
        this.message = message;
        this.data = data;
        this.timestamp = timestamp;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public static <T> ApiResponseDTO<T> success(T data, String message) {
        ApiResponseDTO<T> response = new ApiResponseDTO<>();
        response.setStatus("success");
        response.setCode(200);
        response.setMessage(message);
        response.setData(data);
        return response;
    }

    public static <T> ApiResponseDTO<T> success(T data) {
        return success(data, "Success");
    }

    public static <T> ApiResponseDTO<T> error(String message, int code) {
        ApiResponseDTO<T> response = new ApiResponseDTO<>();
        response.setStatus("error");
        response.setCode(code);
        response.setMessage(message);
        return response;
    }

    @Override
    public String toString() {
        return "ApiResponseDTO [status=" + status + ", code=" + code + ", message=" + message + ", data=" + data
                + ", timestamp=" + timestamp + "]";
    }
}
