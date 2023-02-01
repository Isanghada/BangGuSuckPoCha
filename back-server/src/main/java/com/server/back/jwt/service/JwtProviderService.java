package com.server.back.jwt.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.server.back.jwt.JwtProperties;
import com.server.back.jwt.TokenRequestDto;
import com.server.back.jwt.refreshToken.RefreshToken;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * JWT 토큰 생성과 관련된 서비스
 */
@Service
public class JwtProviderService {

    /**
     * accessToken, refreshToken 생성
     */
    public TokenRequestDto createJwtToken(Long userId, String username) {

        //Access token 생성
        String accessToken = JWT.create()
                .withSubject(username)
                .withExpiresAt(new Date(System.currentTimeMillis() + JwtProperties.AccessToken_TIME))
                .withClaim("userId", userId)
                .withClaim("username", username)
                .sign(Algorithm.HMAC512(JwtProperties.SECRET));

        //Refresh token 생성
        String refreshToken = JWT.create()
                .withSubject(username)
                .withExpiresAt(new Date(System.currentTimeMillis() + JwtProperties.RefreshToken_TIME))
                .withClaim("userId", userId)
                .withClaim("username", username)
                .sign(Algorithm.HMAC512(JwtProperties.SECRET));

        return TokenRequestDto.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    /**
     * access token 생성
     */
    public String createAccessToken(Long userId, String username) {

        String accessToken = JWT.create()
                .withSubject(username)
                .withExpiresAt(new Date(System.currentTimeMillis() + JwtProperties.AccessToken_TIME))
                .withClaim("userId", userId)
                .withClaim("username", username)
                .sign(Algorithm.HMAC512(JwtProperties.SECRET));

        return accessToken;
    }


    /**
     * refreshToken validation 체크(refresh token 이 넘어왔을때)
     * 정상 - access 토큰 생성후 반환
     * 비정상 - null
     */
    public String validRefreshToken(RefreshToken refreshToken) {

        String RefreshToken = refreshToken.getRefreshToken();

        try {
            DecodedJWT verify = JWT.require(Algorithm.HMAC512(JwtProperties.SECRET)).build().verify(RefreshToken);

            //refresh 토큰의 만료시간이 지나지 않아 access 토큰만 새로 생성
            if(!verify.getExpiresAt().before(new Date())) {
                String accessToken = createAccessToken(verify.getClaim("userId").asLong(), verify.getClaim("username").asString());
                return accessToken;
            }
        }catch (Exception e) {

            //refresh 토큰이 만료됨
            return null;
        }
        return null;
    }


}
