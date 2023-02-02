package com.server.back.service.user;

import com.server.back.dto.user.*;

import java.util.List;


public interface UserService {
    UserResponseDto userMyInfo(String username);
    UserResponseDto userInfo(String username);

    boolean userNicknameCheck(String nickname);
    String userUpdate(String username, UserRequestDto requestDto);
    List<PointResponseDto> userPointList(String user);
	Long findByUsername(String username);
    void usePoint(String username, PointRequestDto requestDto);
    void uesrLogout(String username);
    void userDelete(String username);
    void roleChange(String username);
}
