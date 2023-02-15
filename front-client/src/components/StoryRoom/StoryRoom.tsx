import RoomFooterNav from "../Common/RoomFooterNav";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WebRTC from "../WebRTC/WebRTC";
import axios from "axios";
import Loading from "../Common/Loading";
import { toast } from "react-toastify";
import { useAppSelector } from "src/store/hooks";
import FriendSearch from "../Common/FriendSearch";
import NavUserEmojiClickModal from "../Common/NavUserEmojiClickModal";

function StoryRoom(): JSX.Element {
  // const dispatch = useAppDispatch();
  let accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const { PochaId } = useParams();
  const [socket, setSocket] = useState<any>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // 처음에 받아오는 포차 정보
  const [pochaInfo, setPochaInfo] = useState<any>(null);
  // 배경 div
  const bgDiv = useRef<HTMLDivElement>(null);
  // 테마 변경
  const [urlImg, setUrlImg] = useState<any>("bg-rain");
  // 방장 여부
  const [isHost, setIsHost] = useState<boolean>(false);
  // 친구 요청 검색 모달
  const friendSearchState = useAppSelector((state) => {
    return state.friendSearchState;
  });
  // console.log("pochaInfo", pochaInfo);

  const navAlarmReviewEmojiUserData: any = useAppSelector((state: any) => {
    return state.navAlarmReviewEmojiUserData;
  });
  const RoomUserProfileClickCheck: any = useAppSelector((state: any) => {
    return state.RoomUserProfileClickCheck;
  });

  const propSocket = (socket: any) => {
    setSocket(socket);
  };
  const propIsHost = (isHost: boolean) => {
    setIsHost(isHost);
  };

  const getPochaInfo = async () => {
    // try {
    //   const { data } = await axios({
    //     url: `https://i8e201.p.ssafy.io/api/pocha/${Number(PochaId)}`,
    //     headers: {
    //       accessToken: `${accessToken}`,
    //     },
    //   });
    //   setPochaInfo(data.data);
    //   console.log("테마", data.data.themeId);
    //   switch (data.data.themeId) {
    //     case "T0B0":
    //       navigate(`/storyroom/${PochaId}`);
    //       setUrlImg("bg-rain");
    //       break;
    //     case "T0B1":
    //       navigate(`/storyroom/${PochaId}`);
    //       setUrlImg(`bg-pocha`);
    //       break;
    //     case "T0B2":
    //       navigate(`/storyroom/${PochaId}`);
    //       setUrlImg(`bg-hof`);
    //       break;
    //     case "T1B0":
    //       navigate(`/gameroom/${PochaId}`);
    //       // toast.success("포차 설정이 변경되었습니다");
    //       break;
    //   }
    //   setIsLoading(false);
    // } catch (error) {
    //   console.log("포차 정보 받아오기", error);
    // }
    axios({
      method: "GET",
      url: `https://i8e201.p.ssafy.io/api/pocha/${Number(PochaId)}`,
      headers: {
        accessToken: `${accessToken}`,
      },
    }).then((r) => {
      //토큰이상해
      if ("401" === r.data.status) {
        //토큰 재요청
        console.log("토큰 이상함");
        const refreshToken = localStorage.getItem("refreshToken");
        const Username = localStorage.getItem("Username");
        axios({
          method: "get",
          url: `https://i8e201.p.ssafy.io/api/user/auth/refresh/${Username}`,
          headers: {
            refreshToken: refreshToken,
          },
        }).then((r) => {
          //재발급 실패
          if ("401" === r.data.status) {
            localStorage.clear();
            toast.error("인증되지 않은 유저입니다");
            navigate("/");
          }
          //재발급 성공
          else {
            console.log("재발급 성공", r.data.accessToken);
            localStorage.setItem("accessToken", r.data.accessToken);
            accessToken = r.data.accessToken;
            //원래 axios 실행
            axios({
              method: "GET",
              url: `https://i8e201.p.ssafy.io/api/pocha/${Number(PochaId)}`,
              headers: {
                accessToken: `${accessToken}`,
              },
            }).then((r) => {
              setPochaInfo(r.data.data);
              console.log("테마", r.data.data.themeId);
              switch (r.data.data.themeId) {
                case "T0B0":
                  navigate(`/storyroom/${PochaId}`);
                  setUrlImg("bg-rain");
                  break;
                case "T0B1":
                  navigate(`/storyroom/${PochaId}`);
                  setUrlImg(`bg-pocha`);
                  break;
                case "T0B2":
                  navigate(`/storyroom/${PochaId}`);
                  setUrlImg(`bg-hof`);
                  break;
                case "T1B0":
                  navigate(`/gameroom/${PochaId}`);
                  // toast.success("포차 설정이 변경되었습니다");
                  break;
              }
              setIsLoading(false);
            });
          }
        });
      }
      //토큰 정상이야
      else {
        //실행 결과값 그대로 실행
        setPochaInfo(r.data.data);
        console.log("테마", r.data.data.themeId);
        switch (r.data.data.themeId) {
          case "T0B0":
            navigate(`/storyroom/${PochaId}`);
            setUrlImg("bg-rain");
            break;
          case "T0B1":
            navigate(`/storyroom/${PochaId}`);
            setUrlImg(`bg-pocha`);
            break;
          case "T0B2":
            navigate(`/storyroom/${PochaId}`);
            setUrlImg(`bg-hof`);
            break;
          case "T1B0":
            navigate(`/gameroom/${PochaId}`);
            // toast.success("포차 설정이 변경되었습니다");
            break;
        }
        setIsLoading(false);
      }
    });
  };

  useEffect(() => {
    getPochaInfo();
  }, []);

  // console.log('네브 알람 리뷰 이모지 정보: ',navAlarmReviewEmojiUserData);
  // console.log('방 유저 프로필 클릭 체크: ',RoomUserProfileClickCheck);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div
          ref={bgDiv}
          className={`w-screen min-h-screen ${urlImg} bg-contain bg-no-repeat bg-center bg-scroll`}
        >
          {friendSearchState ? <FriendSearch /> : null}
          {RoomUserProfileClickCheck ? (
            <NavUserEmojiClickModal userData={navAlarmReviewEmojiUserData} />
          ) : null}

          {/* 화면 및 게임 공간 */}
          <div className="min-h-[90vh]">
            <WebRTC
              pochaId={PochaId!}
              propSocket={propSocket}
              propIsHost={propIsHost}
              getPochaInfo={getPochaInfo}
            />
          </div>
          <div className="relative bottom-0 left-0 right-0">
            {socket && (
              <RoomFooterNav
                pochaId={PochaId!}
                socket={socket}
                isHost={isHost}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
export default StoryRoom;
