import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  changeFriendSearchState,
  changeMenuFriendChatState,
  changemenuFriendClickUserData,
  changeMenuFriendListApiDataState,
  changeMenuFriendState,
  changeNavAlarmReviewEmojiUserData,
  showRoomUserProfile,
} from "../../store/store";
import styles from "./Common.module.css";
import FriendSearch from "./FriendSearch";


function FriendList(): JSX.Element {

  // 친구 검색
  const [searchFriend,setSearchFriend] = useState<any>()
  // 나를 확인할 유저 아이디
  const username = localStorage.getItem('Username')

  // 메뉴 클릭시
  const dispatch = useAppDispatch();
  const friendListIcon = useRef<any>(null);

  //  메뉴 -> 친구 클릭 상태
  const menuFriendClickCheck: any = useAppSelector((state: any) => {
    return state.menuFriendClickCheck;
  });
  //  메뉴 -> 친구 클릭 -> 챗팅
  const menuFriendChatClickCheck: any = useAppSelector((state: any) => {
    return state.menuFriendChatClickCheck;
  });
  //  메뉴 -> 친구 리스트
  const menuFriendListApiData: any = useAppSelector((state: any) => {
    return state.menuFriendListApiData;
  });

  // 친구 요청 검색 모달
  const friendSearchState = useAppSelector((state)=> {return  state.friendSearchState})

  function UserStateSearch(f_username:any) {
    axios({
      method: 'get',
      url: `https://i8e201.p.ssafy.io/api/user/info/${f_username}`,
    })
    .then((r)=> {
      console.log('넣어따', r.data)
      dispatch(changeNavAlarmReviewEmojiUserData(r.data))
      dispatch(showRoomUserProfile())
    })
  }


  useEffect(() => {
    if (menuFriendClickCheck) {
      friendListIcon.current.classList.remove("hidden");
    } else {
      friendListIcon.current.classList.add("hidden");
    }
  }, [menuFriendClickCheck]);

  const emoji =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Noto_Emoji_KitKat_263a.svg/220px-Noto_Emoji_KitKat_263a.svg.png";
  // const nickname = '라면왕 한통깨'
  const logState =
    "https://upload.wikimedia.org/wikipedia/commons/0/0e/Basic_red_dot.png";

  // 클릭한 유저가 이전에 클릭한 유저와 같은지 체크
  const [checkChatId, setCheckChatId] = useState();

  
  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      console.log(searchFriend)
      console.log(username)
      axios({
        method: 'get',
        url: `https://i8e201.p.ssafy.io/api/user/friend/${username}/${searchFriend}`,
      }).then((r)=> {
        console.log('요청한 친구: ',r.data.data)
        dispatch(changeMenuFriendListApiDataState(r.data.data));
        setSearchFriend("") 
      })
    }}

  const friendList = menuFriendListApiData.map((e: any, idx: any) => {
    const chat_id = e.chat_id;
    return (
      <div
        key={idx}
        className=" grid my-2 cursor-pointer "
        style={{ gridTemplateColumns: "1fr 3fr 1fr" }}
      >
        <div className="flex justify-center items-center h-full pl-2">
          <img className="object-contain h-[80%] " src={e.f_profile} alt="" onClick={()=>{
            console.log(e)
            UserStateSearch(e.f_username)
          }}/>
        </div>
        <div
          className={`flex justify-start items-center pl-3 text-base font-semibold h-full ${styles.menuFriendNeon}`}
          onClick={() => {
            // 클릭한 유저와의 채팅 아이디 체크
            setCheckChatId(e.chat_id);
            // 채팅내용 가져오기
            const getChatList = async () => {
              try {
                const getChat = await axios.get(
                  `https://i8e201.p.ssafy.io/api/user/friend/chat/${chat_id}`
                );
                return getChat.data.data;
              } catch (error) {
                console.log(error);
              }
            };
            getChatList().then((data) => {
              localStorage.setItem('chat_id',chat_id)
              localStorage.setItem('f_nickname',e.f_nickname)
              dispatch(
                changemenuFriendClickUserData({
                  nickname: e.f_nickname,
                  data: data,
                  chat_id: chat_id
                })
              );
            });
  
            dispatch(changeMenuFriendChatState(!menuFriendChatClickCheck));
          }}
        >
          {e.f_nickname}
        </div>
        <div className="flex justify-center items-center h-full">
          <img className="h-[20%] w-[20%]" src={logState} alt="" />
        </div>
      </div>
    );
  });

  return (
    <>
      {
        friendSearchState? <FriendSearch/>:null
      }

      <div
        ref={friendListIcon}
        className="absolute  w-[17rem] h-[35rem] top-[11.6rem] right-[2rem] hidden"
      >
        <div className="h-full w-full">
          <div className="w-full h-full">
            <div
              className="grid h-full bg-black text-white border-2 border-white"
              style={{
                gridTemplateRows: "0.5fr 0.5fr 5fr",
                borderRadius: "24px",
              }}
            >
              <div
                className="grid"
                style={{ gridTemplateColumns: "2fr 1.2fr 1fr 1fr" }}
              >
                <div></div>
                <div className="flex justify-center items-center h-full text-sm">
                  친구목록
                </div>
                <div></div>
                {/* 친구 리스트 및 채팅창 닫기 */}
                <div className="flex justify-center items-center h-full">
                  <img
                    className="h-[50%] cursor-pointer"
                    src={require("../../assets/roomIcon/cancel.png")}
                    alt=""
                    onClick={() => {
                      if (menuFriendChatClickCheck) {
                        dispatch(changeMenuFriendChatState(false));
                      }
                      if (menuFriendClickCheck) {
                        dispatch(changeMenuFriendState());
                      }
                      dispatch(changeFriendSearchState(false))
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center rounded-full bg-white h-[80%] border-2 border-stone-400">
                <input
                  className="w-[84%] h-full text-base text-black font-bold pl-3 "
                  style={{ borderRadius: "100% 0px 0px 100%" }}
                  type="text"
                  onChange={(e)=> {
                    console.log(e.target.value)
                    setSearchFriend(e.target.value)
                  }}
                  onKeyDown={handleKeyPress}
                />
                <div className="w-[5%]"></div>
                <div className="w-[11%] cursor-pointer">
                  <img
                    className="w-[1rem] h-[1rem]"
                    src={require("../../assets/mainIcon/search.png")}
                    alt=""
                  />
                </div>
              </div>
              <div
                className="grid h-full overflow-hidden "
                style={{ gridTemplateRows: "0.02fr 1fr 0.1fr" }}
              >
                <div className="flex justify-start items-center h-full text-white text-xs pl-2">
                  친한친구
                </div>
                <div className={`h-full overflow-scroll ${styles.hideScroll} `}>
                  {friendList}
                </div>
                <div><span className={`cursor-pointer ${styles.friendName}`} onClick={()=> {
                  // 친구 요청 검색 모달 상태
                  dispatch(changeFriendSearchState(true))
                }}>친구요청</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
    
  );
}
export default FriendList;
