import style from "src/components/Main/MainCreateRoom.module.css";
import MainCreateRoomSelect from "src/components/Main/MainCreateRoomSelect";
import MainCreateRoomPeople from "src/components/Main/MainCreateRoomPeople";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  changeCreateRoomChoiceAddTag,
  changeCreateRoomChoiceRemoveTag,
  changeCreateRoomChoiceTagReset,
  showUpdateRoom,
} from "../../store/store";
import MainCreateRoomTheme from "src/components/Main/MainCreateRoomTheme";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import PublicModal from "./PublicModal";
import Loading from "./Loading";

const UpdateRoomInfo = ({
  roomTheme,
  pochaId,
  socket,
}: {
  roomTheme: number;
  pochaId: string;
  socket: any;
}): React.ReactElement => {
  const dispatch = useAppDispatch();
  // 로딩중
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // 현재 포차 정보
  const [pochaInfo, setPochaInfo] = useState<any>(null);
  // 5개 제한 모달 상태 체크
  const [showModal, setShowModal] = useState<boolean>(false);
  // 태그들 가져오기
  const selectTags = useRef<any[]>([]);
  //
  const onClickModalState = () => {
    setShowModal(false);
  };

  const roomTitle = "포차정보수정";
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

  // 전달받아온 함수를 실행해서 창끄기
  const closeModal = () => {
    // onClickHiddenBtn();
    dispatch(showUpdateRoom(false));
  };

  // 태그 리스트
  const [choiceTagList, setChoiceTagList] = useState<string[]>([]);
  console.log('업데이트할 태그리스트',choiceTagList);
  // 태그 선택 기능
  const onSelectTag = (
    tag: string,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!choiceTagList.includes(tag) && choiceTagList.length >= 5) {
      setShowModal(true);
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

  // 인원 수
  const createRoomChoicePeople = useAppSelector((state) => {
    return state.createRoomChoicePeople;
  });
  // 나이
  const createRoomChoiceAge = useAppSelector((state) => {
    return state.createRoomChoiceAge;
  });
  // 지역
  const createRoomChoiceRegion = useAppSelector((state) => {
    return state.createRoomChoiceRegion;
  });
  // 태그
  const createRoomChoiceTag = useAppSelector((state) => {
    return state.createRoomChoiceTag;
  });
  // 테마
  const createRoomThemeCheck = useAppSelector((state) => {
    return state.createRoomThemeCheck;
  });

  // 현재 포차 정보 요청
  const getPochaInfo = async () => {
    try {
      const { data } = await axios({
        url: `https://i8e201.p.ssafy.io/api/pocha/${Number(pochaId)}`,
      });
      setPochaInfo(data.data);
      // 그냥 로딩중 보여주기
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
      // console.log("태그", data.data.tagList);
      const tags = data.data.tagList;
      // 현재 포차의 선택된 태그들 표시해주기
      // ref로 잡아온 리스트 for문 돌리고
      console.log("현재 방 태그들",tags);
      selectTags.current.forEach((tag) => {
        // 현재 포차 태그리스트로 2중 for문
        tags.forEach((tagName: any) => {
          if (tag.innerText === tagName) {
            tag.classList.add(`${style.selectBtn}`);
            // 이렇게 찾아낸건 처음값으로 세팅해준다
            dispatch(changeCreateRoomChoiceAddTag(tagName));
            setChoiceTagList((prev) => [...prev, tagName]);
          }
        });
      });
    } catch (error) {
      console.log("포차 정보 받아오기", error);
    }
  };

  useEffect(() => {
    getPochaInfo();
  }, []);

  // 포차 정보 업데이트 요청
  const updateRoom = async () => {
    try {
      const updateInfo = await axios({
        method: "PUT",
        url: `https://i8e201.p.ssafy.io/api/pocha/${pochaId}`,
        data: {
          age: createRoomChoiceAge,
          isPrivate: false,
          limitUser: createRoomChoicePeople,
          region: createRoomChoiceRegion,
          tagList: choiceTagList,
          themeId: createRoomThemeCheck,
        },
      });
      console.log("포차정보수정????", updateInfo);
      socket.emit("pocha_change", pochaId);
    } catch (error) {
      console.log("포차정보수정", error);
    }
    closeModal();
    // 태그 선택 초기화 함수
    dispatch(changeCreateRoomChoiceTagReset());
  };

  return (
    <>
      {roomTheme === 1 ? (
        <>
          {showModal && <PublicModal data={modalData} fx={onClickModalState} />}
          {isLoading && <Loading />}
          <div
            className={`bg-black bg-opacity-90 overflow-y-auto z-10 fixed top-0 right-0 bottom-0 left-0 flex justify-center items-center text-white`}
          >
            <div
              className={`${style.boxShadow} flex-col items-center bg-black max-w-[48rem] px-16 py-10 rounded-3xl absolute top-20`}
            >
              <div
                className={`${style.neonTitle} font-extrabold text-5xl tracking-wide h-28`}
              >
                {roomTitle}
              </div>
              {pochaInfo && (
                <MainCreateRoomPeople
                  selectOption={peopleOption}
                  pochaInfo={pochaInfo}
                />
              )}
              <div className="flex justify-start w-full">
                {pochaInfo && (
                  <MainCreateRoomSelect
                    selectOption={ageOption}
                    pochaInfo={pochaInfo}
                  />
                )}
                {pochaInfo && (
                  <MainCreateRoomSelect
                    selectOption={regionOption}
                    pochaInfo={pochaInfo}
                  />
                )}
              </div>
              {pochaInfo && (
                <MainCreateRoomTheme
                  selectOption={themeOption}
                  pochaInfo={pochaInfo}
                />
              )}
              <div className="text-left w-full text-xl font-bold mt-2 pt-3 border-t-2">
                태그
              </div>
              <div className="flex justify-center flex-wrap">
                {tagList.map((tag, index) => {
                  return (
                    <div
                      onClick={(event) => onSelectTag(tag, event)}
                      key={index}
                      className={`${style.tagBox}`}
                      ref={(tag) => {
                        selectTags.current[index] = tag;
                      }}
                    >
                      {tag}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end w-full mt-10">
                <input
                  onClick={updateRoom}
                  className={`${style.createBtn} cursor-pointer`}
                  type="button"
                  value="정보수정"
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
          {showModal && <PublicModal data={modalData} fx={onClickModalState} />}
          {isLoading && <Loading />}
          <div
            className={`bg-black bg-opacity-90 overflow-y-auto z-10 fixed top-0 right-0 bottom-0 left-0 flex justify-center items-center text-white`}
          >
            <div
              className={`${style.boxShadow} flex-col items-center bg-black max-w-[48rem] px-16 py-10 rounded-3xl absolute top-20`}
            >
              <div
                className={`${style.neonTitle} font-extrabold text-5xl tracking-wide h-28`}
              >
                {roomTitle}
              </div>
              {roomTheme === 3
                ? pochaInfo && (
                    <MainCreateRoomPeople
                      selectOption={huntingPeopleOption}
                      pochaInfo={pochaInfo}
                    />
                  )
                : pochaInfo && (
                    <MainCreateRoomPeople
                      selectOption={peopleOption}
                      pochaInfo={pochaInfo}
                    />
                  )}
              {pochaInfo && (
                <MainCreateRoomSelect
                  selectOption={ageOption}
                  pochaInfo={pochaInfo}
                />
              )}
              {pochaInfo && (
                <MainCreateRoomSelect
                  selectOption={regionOption}
                  pochaInfo={pochaInfo}
                />
              )}
              <div className="text-left w-full text-xl font-bold mt-2 pt-3 border-t-2">
                태그
              </div>
              <div className="flex justify-center flex-wrap">
                {tagList.map((tag, index) => {
                  return (
                    <div
                      onClick={(event) => onSelectTag(tag, event)}
                      ref={(tag) => {
                        selectTags.current[index] = tag;
                      }}
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
                  onClick={updateRoom}
                  className={`${style.createBtn} cursor-pointer`}
                  type="button"
                  value="정보수정"
                />
                <input
                  onClick={closeModal}
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

export default UpdateRoomInfo;
