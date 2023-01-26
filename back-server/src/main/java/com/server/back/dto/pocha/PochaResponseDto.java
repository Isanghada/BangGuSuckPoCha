package com.server.back.dto.pocha;

import com.server.back.domain.pocha.Participant;
import com.server.back.domain.pocha.Pocha;
import io.swagger.annotations.ApiModel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@ApiModel(value = "PochaResponseDto", description = "포차 응답을 위한 데이터 타입")
public class PochaResponseDto {
    private Long pochaId;
    private Integer age;
    private Integer limitUser;
    private Integer alcohol;
    private Boolean isSsul;
    private Boolean isPrivate;
    private String ssulTitle;
    private String themeId;
    private String region;
    private List<String> tagList;
    private Integer totalCount;
    private Integer maleCount;
    private Integer femaleCount;
    private Boolean isEnd;
    private LocalDateTime createAt;
    private LocalDateTime endAt;

    public PochaResponseDto(Pocha e) {
        this.pochaId = e.getPochaId();
        this.age = e.getAge();
        this.limitUser = e.getLimitUser();
        this.alcohol = e.getAlcohol();
        this.isSsul = e.getIsSsul();
        this.isPrivate = e.getIsPrivate();
        this.ssulTitle = e.getSsulTitle();
        this.themeId = e.getTheme().getThemeId();
        this.region = e.getRegion();
        this.tagList = e.getTag().stream().map(o -> o.getTag()).collect(Collectors.toList());
        for(Participant p : e.getParticipant()){
            if(p.getExitAt() == null) {
                this.maleCount += 1;
                this.femaleCount += 1;
            }
        }
        this.totalCount = this.maleCount + this.femaleCount;
        this.isEnd = e.getIsEnd();
        this.createAt = e.getCreateAt();
        this.endAt = e.getEndAt();
    }
}
