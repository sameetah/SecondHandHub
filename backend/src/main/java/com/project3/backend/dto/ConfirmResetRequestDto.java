package com.project3.backend.dto;

public class ConfirmResetRequestDto {

    public String email;
    public String code;
    public String newPassword;

    public String getCode() {
        return code;
    }

    public String getNewPassword() {
        return newPassword;
    }

}
