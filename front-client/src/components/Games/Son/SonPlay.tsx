import styles from "./SonPlay.module.css";
import { useState, useRef, useEffect } from "react";
import PublicModal from "src/components/Common/PublicModal";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { showRouletteResultModal } from "src/store/store";

function SonPlay({
  socket,
  pochaId,
  pochaUsers,
  pochaInfo,
}: {
  socket: any;
  pochaId: string;
  pochaUsers: any;
  pochaInfo: any;
}): React.ReactElement {
  // 내 이름
  const myName = localStorage.getItem("Username");
  // 방 번호
  const roomName = pochaId;
  // 현재 사람수 받아오기
  const { totalCount } = pochaInfo;
  // 현재 사람수
  const [peopleCount, setPeopleCount] = useState<number>(totalCount);
  // 사람들 네임
  const [peopleName, setPeopleName] = useState<string[]>([]);
  // 사람들 스코어
  const [peopleScore, setPeopleScore] = useState<number[]>([5, 5, 5, 5, 5, 5]);
  // 내 번호 세팅
  const [myNum, setMyNum] = useState<number>(0);
  // 현재 턴 세팅
  const [turn, setTurn] = useState<number>(0);
  // 손가락들 가져옴
  const txtSpan0 = useRef<any>(null);
  const txtSpan1 = useRef<any>(null);
  const txtSpan2 = useRef<any>(null);
  const txtSpan3 = useRef<any>(null);
  const txtSpan4 = useRef<any>(null);
  const txtSpan5 = useRef<any>(null);
  const [txtSpanList, setTxtSpanList] = useState<any[]>([
    txtSpan0,
    txtSpan1,
    txtSpan2,
    txtSpan3,
    txtSpan4,
    txtSpan5,
  ]);

  // 이미지들 가져옴
  // const img0 = useRef<any>(null);
  // const img1 = useRef<any>(null);
  // const img2 = useRef<any>(null);
  // const img3 = useRef<any>(null);
  // const img4 = useRef<any>(null);
  // const img5 = useRef<any>(null);
  // const [imgList, setImgList] = useState<any[]>([
  //   img0,
  //   img1,
  //   img2,
  //   img3,
  //   img4,
  //   img5,
  // ]);

  const setPeopleInfo = () => {
    console.log(pochaUsers,"유저들 리스트");
    pochaUsers.forEach((user: any, index: number) => {
      // setPeopleScore();
      // setTxtSpanList((prev) => prev = [txtSpan0, txtSpan1, txtSpan2, txtSpan3, txtSpan4, txtSpan5]);
      setPeopleName((prev) => [...prev, user.nickname]);
      if (user.username === myName) {
        setMyNum(index);
      }
    });
  };
  
  // 최초 실행
  useEffect(() => {
    // 유저 정보들 세팅
    setPeopleInfo();
    gamestart();
    // 접을때 ..
    socket.on("game_son_fold", (myNum : number) => {
      console.log("새로운배열 갱신되고있냐?", peopleScore);
      const newArray = peopleScore.map((score, index) => {
        if (index === myNum) {
          return score - 1;
        }
        return score
      });
      console.log("새로운배열?", newArray);
      setPeopleScore((prev) => [...newArray]);
      finish();
      // console.log("새로운배열zzzzzzzz?", peopleScore);
    })

    return () => {
      socket.off("game_son_fold");
    };
  }, [peopleScore]);

  //손 만들기(인원수 넘어가는 손은 가리기)
  function gamestart() {
    for (var i = 0; i < 6; i++) {
      if (i >= peopleCount) {
        // console.log(txtSpanList[i].current);
        txtSpanList[i].current.classList.add("hidden");
      }
    }
  }


  //손가락 접기
  function fold() {
    socket.emit("game_son_fold", roomName, myNum);

  }

  // 순서 돌아올때마다 초록색! (조건 말하는 사람(접기 눌러짐))
  // function myTurn(turn) {

  //   // var turnhand = document.getElementById("fingertext"+turn);
  //   // turnhand.style.textShadow = "0px 0px 30px #70FF00";
  //   // turnhand.style.webkitTextStrokeColor= "#007C2A";
  // }

  //게임 끝인지 확인 > 주먹이냐?? 오키 그럼 넘겨
  function finish(){
    const resultList: string[] = [];
    peopleScore.forEach((score, index) => {
      if(score === 1) {
        resultList.push(peopleName[index]);
      }
    })
    if(resultList.length) {
      // alert(`우선 잠오니까 여기까지 ${[...resultList]} 니들 탈락`)
      const signalData = "RESULT"
      const data = resultList;
      socket.emit("game_son_signal", roomName, signalData, data);
    }
  }

  const onClickFold = () => {
    fold();
  };

  return (
    <div className={`${styles.background}`} id="background">
      <div className={`${styles.title}`}>손병호 게임</div>
      <div className={`${styles.layout}`}>
        <div id="hands1" className={`${styles.hands1}`}>
          <div
            className={`w-[230px] h-[250px] flex flex-col items-center`}
            id="txtSpan0"
            ref={txtSpan0}
          >
            <img
              className={`${styles.fingersImg}`}
              src={peopleScore[0] >= 0 ? require(`src/assets/game_son/fingers${peopleScore[0]}.png`) : null}
              alt="people0"
              // ref={img0}
              id="0"
            />
            <div className={`${styles.fingertext}`} id="fingertext1">
              {peopleName[0]}
            </div>
          </div>
          <div
            className={`w-[230px] h-[250px] flex flex-col items-center`}
            id="txtSpan1"
            ref={txtSpan1}
          >
            <img
              className={`${styles.fingersImg}`}
              src={peopleScore[1] >= 0 ? require(`src/assets/game_son/fingers${peopleScore[1]}.png`) : null}
              alt="people1"
              // ref={img1}
              id="1"
            />
            <div className={`${styles.fingertext}`} id="fingertext1">
              {peopleName[1]}
            </div>
          </div>
          <div
            className={`w-[230px] h-[250px] flex flex-col items-center`}
            id="txtSpan2"
            ref={txtSpan2}
          >
            <img
              className={`${styles.fingersImg}`}
              src={peopleScore[2] >= 0 ? require(`src/assets/game_son/fingers${peopleScore[2]}.png`) : null}
              alt="people2"
              // ref={img2}
              id="2"
            />
            <div className={`${styles.fingertext}`} id="fingertext1">
              {peopleName[2]}
            </div>
          </div>
        </div>
        <div id="hands2" className={`${styles.hands2}`}>
          <div
            className={`w-[230px] h-[250px] flex flex-col items-center`}
            id="txtSpan3"
            ref={txtSpan3}
          >
            <img
              className={`${styles.fingersImg}`}
              src={peopleScore[3] >= 0 ? require(`src/assets/game_son/fingers${peopleScore[3]}.png`) : null}
              alt="people3"
              // ref={img3}
              id="3"
            />
            <div className={`${styles.fingertext}`} id="fingertext1">
              {peopleName[3]}
            </div>
          </div>
          <div
            className={`w-[230px] h-[250px] flex flex-col items-center`}
            id="txtSpan4"
            ref={txtSpan4}
          >
            <img
              className={`${styles.fingersImg}`}
              src={peopleScore[4] >= 0 ? require(`src/assets/game_son/fingers${peopleScore[4]}.png`) : null}
              alt="people4"
              // ref={img4}
              id="4"
            />
            <div className={`${styles.fingertext}`} id="fingertext1">
              {peopleName[4]}
            </div>
          </div>
          <div
            className={`w-[230px] h-[250px] flex flex-col items-center`}
            id="txtSpan5"
            ref={txtSpan5}
          >
            <img
              className={`${styles.fingersImg}`}
              src={peopleScore[5] >= 0 ? require(`src/assets/game_son/fingers${peopleScore[5]}.png`) : null}
              alt="people5"
              // ref={img5}
              id="5"
            />
            <div className={`${styles.fingertext}`} id="fingertext1">
              {peopleName[5]}
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.layout2}`}>
        <input
          type="button"
          className={`${styles.button}`}
          onClick={onClickFold}
          value="접기"
        />
      </div>
    </div>
  );
}

export default SonPlay;
