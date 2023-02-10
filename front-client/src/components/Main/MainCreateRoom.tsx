import style from "./MainCreateRoom.module.css";
import MainCreateRoomSelect from "./MainCreateRoomSelect";
import MainCreateRoomPeople from "./MainCreateRoomPeople";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  changeCarouselState,
  changeCreateRoomChoiceAddTag,
  changeCreateRoomChoiceRemoveTag,
  changeCreateRoomChoiceTagReset,
  changeThemeRoomState,
  showPublicModal,
} from "../../store/store";
import MainCreateRoomTheme from "./MainCreateRoomTheme";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicModal from "../Common/PublicModal";

const MainCreateRoom = ({
  // onClickHiddenBtn,
  roomTheme,
}: {
  onClickHiddenBtn: Function;
  roomTheme: number;
}): React.ReactElement => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // username (현재는 내꺼)
  const username = localStorage.getItem("Username");

  const roomTitle = ["소통포차", "게임포차", "헌팅포차"];
  // 후에 내 지역과 내 나이 세팅해야함
  const regionOption = ["지역", "전국", "부산광역시"];
  const ageOption = ["나이", "ALL", "20대"];
  const themeOption = ["테마", "이자카야", "포장마차", "맥주"];
  const peopleOption = ["인원", "2", "3", "4", "5", "6"];
  const huntingPeopleOption = ["인원", "2", "4", "6"];
  const tagList = [
    "애니메이션",
    "게임",
    "연애",
    "결혼",
    "영화",
    "가수",
    "축구",
    "연예인",
    "타로",
    "노래",
    "운동",
    "소주",
    "맥주",
    "막걸리",
    "기타",
  ];
  // 5개 제한 태그 관련
  const modalData = {
    type: "tag",
    msg: "태그는 5개까지만 선택가능합니다",
  };
  const showModal = useAppSelector((state) => {
    return state.PublicModal;
  });

  // 전달받아온 함수를 실행해서 창끄고 캐러셀로 되돌리기
  const closeModal = () => {
    // onClickHiddenBtn();
    dispatch(changeThemeRoomState(0));
    dispatch(changeCarouselState());
  };

  // 태그 리스트
  const [choiceTagList, setChoiceTagList] = useState<string[]>([]);
  console.log('태그리스트',choiceTagList);
  // 태그 선택 기능
  const onSelectTag = (
    tag: string,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!choiceTagList.includes(tag) && choiceTagList.length >= 5) {
      dispatch(showPublicModal(true));
      return;
    }
    if (choiceTagList.includes(tag)) {
      setChoiceTagList((prev) => {
        const ttest = prev.filter((data) => {
          return data !== tag;
        });
        console.log(ttest);
        return ttest;
      });
    } else if (!choiceTagList.includes(tag)) {
      setChoiceTagList((prev) => [...prev, tag]);
    }

    const data = event.target as HTMLElement;
    let choiceText: any = data.innerText;

    // 이미 클릭이 돼서 제거할 때
    if (data.classList.contains(`${style.selectBtn}`)) {
      dispatch(changeCreateRoomChoiceRemoveTag(choiceText));
    } else {
      // 추가할 때
      dispatch(changeCreateRoomChoiceAddTag(choiceText));
    }
    (event.target as Element).classList.toggle(`${style.selectBtn}`);
  };

  const createRoomChoicePeople = useAppSelector((state) => {
    return state.createRoomChoicePeople;
  });
  const createRoomChoiceAge = useAppSelector((state) => {
    return state.createRoomChoiceAge;
  });
  const createRoomChoiceRegion = useAppSelector((state) => {
    return state.createRoomChoiceRegion;
  });
  const createRoomChoiceTag = useAppSelector((state) => {
    return state.createRoomChoiceTag;
  });
  const createRoomThemeCheck = useAppSelector((state) => {
    return state.createRoomThemeCheck;
  });

  return (
    <>
      {roomTheme === 1 ? (
        <>
          {showModal && <PublicModal data={modalData} />}
          <div
            className={`bg-black bg-opacity-90 overflow-y-auto z-10 fixed top-0 right-0 bottom-0 left-0 flex justify-center items-center text-white`}
          >
            <div
              className={`${style.boxShadow} flex-col items-center bg-black max-w-[48rem] px-16 py-10 rounded-3xl absolute top-20`}
            >
              <div
                className={`${style.neonTitle} font-extrabold text-5xl tracking-wide h-28`}
              >
                {roomTitle[roomTheme - 1]}
              </div>
              <MainCreateRoomPeople selectOption={peopleOption} />
              <div className="flex justify-start w-full">
                <MainCreateRoomSelect selectOption={ageOption} />
                <MainCreateRoomSelect selectOption={regionOption} />
              </div>
              <MainCreateRoomTheme selectOption={themeOption} />
              <div className="text-left w-full text-xl font-bold mt-2 pt-3 border-t-2">
                태그
              </div>
              <div className="flex justify-center flex-wrap">
                {tagList.map((tag, index) => {
                  return (
                    <div
                      onClick={(event) => onSelectTag(tag, event)}
                      // ref={(tag) => {
                      //   selectTags.current[index] = tag;
                      // }}
                      key={index}
                      className={`${style.tagBox}`}
                    >
                      {tag}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end w-full mt-10">
                <input
                  className={`${style.createBtn} cursor-pointer`}
                  type="submit"
                  value="포차생성"
                  onClick={() => {
                    console.log("방 허용 나이", createRoomChoiceAge);
                    console.log("현재 인원수", createRoomChoicePeople);
                    console.log("방 허용 지역", createRoomChoiceRegion);
                    console.log("클릭한 태그", createRoomChoiceTag);
                    console.log("클릭한 테마Id", createRoomThemeCheck);

                    axios({
                      method: "post",
                      url: "https://i8e201.p.ssafy.io/api/pocha",
                      data: {
                        age: createRoomChoiceAge,
                        isPrivate: false,
                        limitUser: createRoomChoicePeople,
                        region: createRoomChoiceRegion,
                        tagList: choiceTagList,
                        themeId: createRoomThemeCheck,
                      },
                    }).then((r) => {
                      const PochaId = r.data.data;
                      axios({
                        method: "post",
                        url: "https://i8e201.p.ssafy.io/api/pocha/enter",
                        data: {
                          isHost: true,
                          pochaId: PochaId,
                          username: username,
                        },
                      }).then((r) => {
                        console.log(r.data);
                        navigate(`/storyroom/${PochaId}`);
                        // 방 만들기 창 종료
                        dispatch(changeThemeRoomState(0));
                      });
                    });
                  }}
                />
                <input
                  onClick={() => {
                    closeModal();
                    // 태그 선택 초기화 함수
                    dispatch(changeCreateRoomChoiceTagReset());
                  }}
                  className={`${style.cancelBtn} cursor-pointer`}
                  type="button"
                  value="취소"
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {showModal && <PublicModal data={modalData} />}
          <div
            className={`bg-black bg-opacity-90 overflow-y-auto z-10 fixed top-0 right-0 bottom-0 left-0 flex justify-center items-center text-white`}
          >
            <div
              className={`${style.boxShadow} flex-col items-center bg-black max-w-[48rem] px-16 py-10 rounded-3xl absolute top-20`}
            >
              <div
                className={`${style.neonTitle} font-extrabold text-5xl tracking-wide h-28`}
              >
                {roomTitle[roomTheme - 1]}
              </div>
              {roomTheme === 3 ? (
                <MainCreateRoomPeople selectOption={huntingPeopleOption} />
              ) : (
                <MainCreateRoomPeople selectOption={peopleOption} />
              )}
              <MainCreateRoomSelect selectOption={ageOption} />
              <MainCreateRoomSelect selectOption={regionOption} />
              <div className="text-left w-full text-xl font-bold mt-2 pt-3 border-t-2">
                태그
              </div>
              <div className="flex justify-center flex-wrap">
                {tagList.map((tag, index) => {
                  return (
                    <div
                      onClick={(event) => onSelectTag(tag, event)}
                      // ref={(tag) => {
                      //   selectTags.current[index] = tag;
                      // }}
                      key={index}
                      className={`${style.tagBox}`}
                    >
                      {tag}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end w-full mt-10">
                <input
                  className={`${style.createBtn} cursor-pointer`}
                  type="submit"
                  value="포차생성"
                  onClick={() => {
                    console.log("방 허용 나이", createRoomChoiceAge);
                    console.log("현재 인원수", createRoomChoicePeople);
                    console.log("방 허용 지역", createRoomChoiceRegion);
                    console.log("클릭한 태그", createRoomChoiceTag);
                    console.log("클릭한 테마Id", createRoomThemeCheck);

                    axios({
                      method: "post",
                      url: "https://i8e201.p.ssafy.io/api/pocha",
                      data: {
                        age: createRoomChoiceAge,
                        isPrivate: false,
                        limitUser: createRoomChoicePeople,
                        region: createRoomChoiceRegion,
                        tagList: choiceTagList,
                        themeId: createRoomThemeCheck,
                      },
                    }).then((r) => {
                      const PochaId = r.data.data;
                      axios({
                        method: "post",
                        url: "https://i8e201.p.ssafy.io/api/pocha/enter",
                        data: {
                          isHost: true,
                          pochaId: PochaId,
                          username: username,
                        },
                      }).then((r) => {
                        if (roomTheme === 2) {
                          navigate(`/gameroom/${PochaId}`);
                        } else if (roomTheme === 3) {
                          navigate(`/huntingroom/${PochaId}`);
                        } 
                        // 방 만들기 창 종료
                        dispatch(changeThemeRoomState(0));
                      });
                    });
                  }}
                />
                <input
                  onClick={() => {
                    closeModal();
                    // 태그 선택 초기화 함수
                    dispatch(changeCreateRoomChoiceTagReset());
                  }}
                  className={`${style.cancelBtn} cursor-pointer`}
                  type="button"
                  value="취소"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MainCreateRoom;
