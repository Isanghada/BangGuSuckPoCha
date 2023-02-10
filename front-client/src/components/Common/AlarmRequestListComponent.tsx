import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { changeAlarmApiDataState, changeAlarmClickState } from "../../store/store";
import styles from './Common.module.css'

// 요청리스트
function RequestListComponent({from_nickname,sentence,invite_id,pocha_id,f_request_id}:any):JSX.Element {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const username = localStorage.getItem('Username')

  const alarmClickState = useAppSelector((state:any)=> {return state.alarmClickState})
  console.log('포차번호',pocha_id, '초대번호',invite_id );
  
  return (
    <div className={`grid h-[4rem] w-full ${styles.shortBorder}`} style={{gridTemplateRows: '1fr 0.8fr' }}>
      <div className="flex justify-start items-center h-full w-[95%] ml-[5%] text-lg font-normal"><span className={`${styles.nickNameNeon}`}>{from_nickname}</span></div>
      <div className="grid" style={{gridTemplateColumns: '3fr 1fr'}}>
        <div className="flex justify-start items-center h-full w-[92%] ml-[8%] text-xs"><span className={`${styles.sentenceNeon}`}>님에게 {sentence} 왔습니다</span></div>
        <div className="grid" style={{gridTemplateColumns: '1fr 1fr'}}>
          <div className="flex justify-center items-center cursor-pointer">
            <img className="flex justify-center items-center h-[60%]" src={require('../../assets/roomIcon/check.png')} alt="" 
            onClick={()=> {
              // 승인했을때
              if (alarmClickState === 0) {
                  axios({
                    method: 'post',
                    url: `https://i8e201.p.ssafy.io/api/user/friend/accept/${f_request_id}`
                  })
                  .then(()=> {
                    axios({
                      method:'get',
                      url: `https://i8e201.p.ssafy.io/api/user/friend/request/${username}`
                    })
                    .then((r)=> {
                      dispatch(changeAlarmApiDataState(r.data.data))
                      toast.success("요청을 승인하였습니다");
                    })
                  })
                  
              } else if (alarmClickState === 1) {
                axios({
                  method: 'post',
                  url: `https://i8e201.p.ssafy.io/api/pocha/invite/accept/${invite_id}/${pocha_id}`
                })
                .then((r)=> {
                  console.log('초대 승인해따', r.data);
                  // 못들어 갈 경우
                  if (r.data.message === 'fail') {
                    toast.error('만료된 요청입니다')
                    // 다시 데이터 갱신시켜주기
                    axios({
                      method:'get',
                      url: `https://i8e201.p.ssafy.io/api/pocha/invite/${username}`
                    })
                    .then((r)=> {
                      // 포차Id에 따른 중복제거 후 데이터 보내기
                      const checkpochaId:number[] = []
                      const setData:(number|string)[] = []
                      const data:(number|string)[] = r.data.data
                      data.forEach((e:any)=> {
                        if (checkpochaId.includes(e.pochaId)!== true) {
                          checkpochaId.push(e.pochaId)
                          setData.push(e)
                        }
                      })
                      dispatch(changeAlarmClickState(1))
                      dispatch(changeAlarmApiDataState(setData))
                    })
                  } else {
                    // 요청에 성공해서 들어가려고 할 때
                    const pochaId = r.data.data.pochaId
                    const themeId = r.data.data.themeId
                    axios({
                      method: 'post',
                      url: 'https://i8e201.p.ssafy.io/api/pocha/enter',
                      data: {
                        // 초대 받은거를 승인하는거라 false
                        "isHost": 'false',
                        "pochaId": pochaId,
                        'username': username
                        }
                      })
                      .then((r)=> {
                        if (themeId.slice(0,2) === 'T0') {
                          navigate(`/storyroom/${pochaId}`)
                        } else if (themeId.slice(0,2) === 'T1') {
                          navigate(`/gameroom/${pochaId}`)
                        }
                      })
                    }
                  
                })
              }
            }}/>
          </div>
          {/* 거절했을때 */}
          <div className="flex justify-center items-center cursor-pointer">
            <img className="flex justify-center items-center h-[60%]" src={require('../../assets/roomIcon/cancel.png')} alt="" 
            onClick={()=> {
              if (alarmClickState === 0) {
                axios({
                  method: 'delete',
                  url: `https://i8e201.p.ssafy.io/api/user/friend/refuse/${f_request_id}`
                })
                .then(()=> {
                  axios({
                    method:'get',
                    url: `https://i8e201.p.ssafy.io/api/user/friend/request/${username}`
                  })
                  .then((r)=> {
                    dispatch(changeAlarmApiDataState(r.data.data))
                    toast.success("요청을 거절하였습니다.");
                  })
                })
              } else if (alarmClickState === 1) {
                axios({
                  method: 'delete',
                  url: `https://i8e201.p.ssafy.io/api/pocha/invite/refuse/${invite_id}`
                })
                .then((r)=> {
                  axios({
                    method:'get',
                    url: `https://i8e201.p.ssafy.io/api/pocha/invite/${username}`
                  })
                  .then((r)=> {
                    dispatch(changeAlarmClickState(1))
                    dispatch(changeAlarmApiDataState(r.data.data))
                    toast.success("요청을 거절하였습니다.");
                  })
                })
              }
            }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default RequestListComponent