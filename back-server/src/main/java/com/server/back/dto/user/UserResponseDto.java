package com.server.back.dto.user;

import com.server.back.domain.user.User;
import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@ApiModel(value = "UserResponseDto", description = "User 정보 조회")
public class UserResponseDto {
    private String username;
    private String nickname;
    private String gender;
    private String birth;
    private String region;
    private String profile;
    private Double manner;
    private String comment;
    private Integer point;

    public UserResponseDto(User e) {
        this.username = e.getUsername();
        this.nickname = e.getNickname();
        this.gender = e.getGender();
        this.birth = e.getBirth();
        String sidoName = e.getRegion().getSidoName();
        String gugunName = e.getRegion().getGugunName();
        this.region = (sidoName + " " + (gugunName != null ? gugunName : "")).trim();
        this.profile = e.getProfile();
        this.manner = e.getManner().doubleValue();
        this.comment = e.getComment();
        this.point = e.getPoint();
    }
}
