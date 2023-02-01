package com.server.back.controller;


import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.server.back.dto.friend.FRequestDto;
import com.server.back.dto.friend.FRequestResponseDto;
import com.server.back.dto.friend.FriendResponseDto;
import com.server.back.service.friend.FriendService;
import com.server.back.service.user.UserService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RequestMapping("/user/friend")
@RestController
public class FriendController {
	
	@Autowired
	private FriendService friendService;
	
	@Autowired
	private UserService userService;
	
	
    @ApiOperation(value = "친구 목록")
    @GetMapping("/{username}")
    // FriendResponseDto 추가하면 [Map -> FriendResponseDto]로 변경
    public ResponseEntity<Map<String, Object>> friendList(@PathVariable(value = "username") String username){
    	Map<String, Object> response = new HashMap<>();
    	Long userId = userService.findByUsername(username);
    	List<FriendResponseDto> friendResponseDto = friendService.friendList(userId);
    	response.put("data",friendResponseDto);
    	response.put("message", "success");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    
    @ApiOperation(value = "친구 목록 검색")
    @GetMapping("/{username}/{f_nickname}")
    // FriendResponseDto 추가하면 [Map -> FriendResponseDto]로 변경
    public ResponseEntity<Map<String, Object>> friendSearchList(@PathVariable(value = "username") String username, @PathVariable(value = "f_nickname") String fNickname){
    	Map<String, Object> response = new HashMap<>();
    	Long userId = userService.findByUsername(username);
    	List<FriendResponseDto> friendResponseDto = friendService.searchFriend(userId, fNickname);
    	response.put("data",friendResponseDto);
    	response.put("message", "success");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @ApiOperation(value = "친구 삭제")
    @DeleteMapping("/{username}/{you_id}")
    public ResponseEntity<Map<String, Object>> friendDelete(@PathVariable(value = "username") String username, @PathVariable(value = "you_id") Long you_id){
    	Map<String, Object> response = new HashMap<>();
    	Long my_id = userService.findByUsername(username);
    	friendService.deleteFriend(my_id, you_id);
    	response.put("message", "success");
    	return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    
    @ApiOperation(value = "친한 친구 설정")
    @PutMapping("/{username}/{you_id}")
    public ResponseEntity<Map<String, Object>> friendUpdate(@PathVariable(value = "username") String username, @PathVariable(value = "you_id") Long you_id){
    	Map<String, Object> response = new HashMap<>();
    	//
    	Long my_id = userService.findByUsername(username);
    	friendService.bestFriend(my_id, you_id);
    	response.put("message", "success");
    	return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    
    @ApiOperation(value = "친구 요청 목록")
    @GetMapping("/request/{username}")
    public ResponseEntity<Map<String, Object>> friendRequestList(@PathVariable(value = "username") String username){
    	Map<String, Object> response = new HashMap<>();
    	//
    	Long my_id = userService.findByUsername(username);
    	System.out.println(my_id);
        List<FRequestResponseDto> fRequestResponseDto = friendService.frequestList(my_id);
        response.put("data", fRequestResponseDto);
        response.put("message","success");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    
    @ApiOperation(value = "친구 요청")
    @PostMapping("/request")
    public ResponseEntity<Map<String, Object>> friendRequest(@RequestBody FRequestDto requestDto){
    	Map<String, Object> response = new HashMap<>();
    	friendService.requestFriend(requestDto);
    	response.put("message", "success");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    
    @ApiOperation(value = "친구 요청 수락")
    @PostMapping("/accept/{f_request_id}")
    public ResponseEntity<Map<String, Object>> friendRequestAccept(@PathVariable(value = "f_request_id") Long f_request_id){
    	Map<String, Object> response = new HashMap<>();
    	friendService.acceptFriend(f_request_id);
    	response.put("message","success");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    
    @ApiOperation(value = "친구 요청 거절")
    @DeleteMapping("/refuse/{f_request_id}")
    public ResponseEntity<Map<String, Object>> friendRequestDelete(@PathVariable(value = "f_request_id") Long fRequestId){
    	Map<String, Object> response = new HashMap<>();
    	friendService.refuseFriend(fRequestId);
    	response.put("message","success");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    /* API 구현 X */
    @ApiOperation(value = "채팅 전송")
    @PostMapping("/request/chat")
    public ResponseEntity<String> friendChat(/*@RequestBody MessageRequestDto requestDto*/){
        return new ResponseEntity<>("채팅 전송 완료", HttpStatus.OK);
    }
    
    
    @ApiOperation(value = "채팅 전송")
    @GetMapping("/request/chat/{chat_id}")
    // MessageResponseDto 추가후 [Map -> MessageResponseDto]로 변경
    public ResponseEntity<List<Map<String, Object>>> friendChatList(@PathVariable(value = "chat_id") String chatId){
        List<Map<String, Object>> messageResponseDto = new ArrayList<>();
        messageResponseDto.add(new HashMap<>());
        messageResponseDto.get(0).put("message_id", 700);
        messageResponseDto.get(0).put("user_id", 700);
        messageResponseDto.get(0).put("user_nickname", "닉네임");
        messageResponseDto.get(0).put("content", "채팅 내용");
        messageResponseDto.get(0).put("create_at", LocalDateTime.now());
        return new ResponseEntity<>(messageResponseDto, HttpStatus.OK);
    }
}
