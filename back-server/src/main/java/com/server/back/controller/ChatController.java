package com.server.back.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.server.back.domain.friend.Chat;
import com.server.back.domain.friend.ChatRepository;
import com.server.back.domain.friend.Message;
import com.server.back.domain.friend.MessageRepository;
import com.server.back.domain.user.User;
import com.server.back.domain.user.UserRepository;
import com.server.back.dto.friend.FriendResponseDto;
import com.server.back.dto.friend.MessageRequestDto;
import com.server.back.dto.friend.MessageResponseDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ChatController {
	
	private final SimpMessagingTemplate template; //특정 Broker로 메세지를 전달
	
	private final ChatRepository chatRepository;
	private final UserRepository userRepository;
	private final MessageRepository messageRepository;

	// Client가 send 할 수 있는 경로
	// 입장
	@MessageMapping("/chat/{chat_id}")
	public void message(@DestinationVariable("chat_id") Long chat_id) {
		
		List<Message> message = messageRepository.findByChatId_chatId(chat_id);
		if(message != null) {
			List<MessageResponseDto> messageResponseDto = message.stream().map(m -> new MessageResponseDto(m)).collect(Collectors.toList());
			template.convertAndSend("/sub/chat/room/" + chat_id , messageResponseDto);
		}
		
	}
	
	@MessageMapping(value = "/chat/message")
	public void message(MessageRequestDto requestDto) {
		
		//DB에 채팅내용 저장
		Chat chat = chatRepository.findByChatId(requestDto.getChat_id());
		User user = userRepository.findByUserId(requestDto.getUser_id());
		Message message = requestDto.toEntity(chat, user, requestDto.getContent());
		messageRepository.save(message);
		
		MessageResponseDto responseDto = MessageResponseDto.builder().message(message).build();
		
		
		template.convertAndSend("/sub/chat/room/" + message.getChatId().getChatId(), message);
	}
	
	

}
