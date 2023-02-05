import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { changeMenuFriendChatState, changemenuFriendClickUserData, changeMenuFriendState} from '../../store/store'
import styles from './Common.module.css'
function FriendList():JSX.Element {
  
  // 메뉴 클릭시 
  const dispatch = useAppDispatch()
  const friendListIcon = useRef<any>(null);
  
  //  메뉴 -> 친구 클릭 상태
  const menuFriendClickCheck: any = useAppSelector((state: any) => {
    return state.menuFriendClickCheck
  })
  //  메뉴 -> 친구 클릭 -> 챗팅
  const menuFriendChatClickCheck: any = useAppSelector((state: any) => {
    return state.menuFriendChatClickCheck
  })
  //  메뉴 -> 친구 리스트
  const menuFriendListApiData: any = useAppSelector((state: any) => {
    return state.menuFriendListApiData
  })
  

  useEffect(()=> {
    if (menuFriendClickCheck) {
      friendListIcon.current.classList.remove("hidden");
    } else {
      friendListIcon.current.classList.add("hidden");
    }
  },[menuFriendClickCheck])
  
  const emoji = 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Noto_Emoji_KitKat_263a.svg/220px-Noto_Emoji_KitKat_263a.svg.png'
  // const nickname = '라면왕 한통깨'
  const logState = 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Basic_red_dot.png'
  
  

  // 클릭한 유저가 이전에 클릭한 유저와 같은지 체크
  const [checkChatId,setCheckChatId] = useState()

  const friendList = menuFriendListApiData.map((e:any, idx:any)=> {
    console.log(e.f_nickname)
    const chatData = e.chat_id
    return (
      <div key={idx} className=" grid my-2 cursor-pointer " style={{gridTemplateColumns: '1fr 3fr 1fr'}} onClick={()=> {
        // 클릭한 유저와의 채팅 아이디 체크
        setCheckChatId(e.chat_id)
        // 채팅내용 가져오기
        const getChatList = async() => {
          try {
            const getChat = await axios.get(`https://i8e201.p.ssafy.io/api/user/friend/chat/${chatData}`) 
            return getChat.data.data
          } catch(error) {
            console.log(error)
          }
        }
        getChatList().then((data)=> {
          dispatch(changemenuFriendClickUserData({nickname:e.f_nickname,data:data}))
        })
        
        if (checkChatId === chatData) {
          dispatch(changeMenuFriendChatState(!menuFriendChatClickCheck))
        } else {
          dispatch(changeMenuFriendChatState(true))
        }
        
      }}>
        <div className="flex justify-center items-center h-full pl-2"><img className="object-contain h-[80%] " src={emoji} alt="" /></div>
        <div className="flex justify-start items-center pl-3 text-base font-semibold h-full">{e.f_nickname}</div>
        <div className="flex justify-center items-center h-full"><img className="h-[20%] w-[20%]" src={logState} alt="" /></div>
      </div>
    )
  })

  return (
    <div ref={friendListIcon} className="absolute  w-[17rem] h-[35rem] top-[11.6rem] right-[2rem] hidden">
      <div className="h-full w-full" >
        <div className="w-full h-full">
          <div className="grid h-full bg-black text-white border-2 border-white" style={{gridTemplateRows: '0.5fr 0.5fr 5fr', borderRadius: '24px'}}>
            <div className="grid" style={{gridTemplateColumns: '2fr 1fr 1fr 1fr'}}>
              <div></div>
              <div className='flex justify-center items-center h-full'>INBOX</div>
              <div></div>
              {/* 친구 리스트 및 채팅창 닫기 */}
              <div className='flex justify-center items-center h-full'>
                <img className='h-[50%] cursor-pointer' src={require('../../assets/roomIcon/cancel.png')} alt="" onClick={()=> {
                  if (menuFriendChatClickCheck) {
                    dispatch(changeMenuFriendChatState(false))
                  } 
                  if (menuFriendClickCheck) {
                    dispatch(changeMenuFriendState())
                  }
                }}/>
              </div>
            </div>
            <div className="flex justify-center rounded-full h-full"><input className="border-2 border-stone-400 w-[97%] h-[80%] rounded-full " type="text" /></div>
            <div className="grid h-full overflow-hidden " style={{gridTemplateRows: '0.0fr 1fr 0.04fr'}}>
              <div className="flex justify-start items-center h-full text-white text-xs pl-2">친한친구</div>
              <div className={`h-full overflow-scroll ${styles.hideScroll}`}>
                {
                  friendList 
                }
              </div>
              <div className=""></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default FriendList