import { useEffect, useRef } from "react";
import { useAppSelector } from "../../store/hooks";
import styles from '../Common/Common.module.css'
function FriendChat():JSX.Element {
  const friendChat = useRef<any>(null);
  //  메뉴 -> 친구 클릭 -> 챗팅
  const menuFriendChatClickCheck: any = useAppSelector((state: any) => {
    return state.menuFriendChatClickCheck
  })

  // 채팅구역
  const chatArea = useRef<any>(null)
  // 해당 구역 가장 아래위치 체크후 해당 위치가 default 되도록 하기
  console.log('채팅구역: ',chatArea&&chatArea.current?.scrollHeight) 
  
  useEffect(()=> {
    if (menuFriendChatClickCheck) {
      friendChat.current.classList.remove("hidden");
    } else {
      friendChat.current.classList.add("hidden");
    }
  },[menuFriendChatClickCheck])


  // 클릭 되어진 유저와의 데이터
  const menuFriendClickUserData: any = useAppSelector((state)=> {return state.menuFriendClickUserData})
  const {nickname, data} = menuFriendClickUserData
  
  function MyChat({content}:any):JSX.Element {
    return (
      <div className="flex justify-end items-center my-1">
        <span className="bg-blue-400 text-white">
          {content}
        </span>
      </div>
    )
  }
  
  function OtherChat({content}:any):JSX.Element {
    return (
      <div className="flex justify-start items-center my-1">
        <span className="bg-red-300 text-white">
          {content}
        </span>
      </div>
    )
  }

  const scrollToBottom = () => {
    if (chatArea.current) {
      chatArea.current.scrollTop = chatArea.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [chatArea]);

  return (
    <div ref={friendChat} className="absolute  w-[33rem] h-[35rem] max-h-[35rem] top-[11.6rem] right-[19rem] hidden">
        <div className="relative grid w-full h-full rounded-[24px] bg-black text-white" style={{gridTemplateRows: '0.5fr 0.5fr 7fr 1fr', border:'solid 2px white'}}>
            <div className="flex justify-center items-center h-[1.8rem] max-h-[1.8rem] w-full  text-white rounded-[100px] ">Chat</div>
            <div className="flex justify-center items-center h-[2.6rem] max-h-[2.6rem] w-full  rounded-[15px] ">{nickname}</div>
            {/* 채팅 공간 */}
            <div ref={chatArea} className={`grid w-full bg-black h-full text-white overflow-scroll ${styles.hideScroll}`}>
              {
                
                data&&data.map((chat:any)=>{
                  return (
                    <div className="flex flex-col justify-start w-full h-full ">
                      {
                        chat.user_nickname === menuFriendClickUserData.nickname? <MyChat content={chat.content}/> : <OtherChat content={chat.content}/>
                      }
                    </div>
                  )
                })
              }
            </div>

            <div className="grid h-full w-full" style={{gridTemplateColumns: '1fr 0.12fr'}}>
              <input className="my-auto mx-auto h-[55%] w-[90%] max-w-[90%] rounded-[24px] pl-4 text-black" style={{border: 'groove 2px rgba(225,225,225,0.4)'}} placeholder='Search for anything...' type="text" />
              <div className="my-auto mr-[10%] h-[55%] w-[90%] mx-auto">
                <img src={require('../../assets/friendChatIcon/dm.png')} alt="" />
              </div>
            </div>
      </div>
    </div>
  )
}
export default FriendChat