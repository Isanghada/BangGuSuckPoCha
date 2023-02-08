import RoomFooterNav from "../Common/RoomFooterNav";
import styles from "./StoryRoom.module.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WebRTC from "../WebRTC/WebRTC";
import axios from "axios";
import Loading from "../Common/Loading";

function StoryRoom(): JSX.Element {
  // const dispatch = useAppDispatch();
  const { PochaId } = useParams();
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // 처음에 받아오는 포차 정보
  const [pochaInfo, setPochaInfo] = useState<any>(null);

  const [urlImg, setUrlImg] = useState<any>(`url('src/assets/theme/izakaya.jpg')`);

  console.log('pochaInfo',pochaInfo);

  const propSocket = (socket: any) => {
    setSocket(socket);
  };

  const getPochaInfo = async () => {
    console.log("PochaId", Number(PochaId));
    try {
      const {data} = await axios({
        url: `https://i8e201.p.ssafy.io/api/pocha/${Number(PochaId)}`,
      });
      setPochaInfo(data.data);
      console.log('테마아이이디',data.data.themeId)
      // switch (data.data.themeId) {
      //   case "T0B0":
      //     setUrlImg(`url('src/assets/theme/izakaya.jpg')`);
      //     break
      //   case "T0B1":
      //     setUrlImg(`url('src/assets/theme/pocha.jpg')`);
      //     break
      //   case "T0B2":
      //     setUrlImg(`url('src/assets/theme/hof.jpg')`);
      //     break
      // }
      setIsLoading(false);
    } catch (error) {
      console.log("포차 정보 받아오기", error);
    }
  };

  useEffect(() => {
    getPochaInfo();
  }, []);


  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div
          // className={`w-screen min-h-screen bg-scroll`}
          className={`w-screen min-h-screen bg-[${urlImg}] bg-contain bg-no-repeat bg-center bg-scroll`}
        >
          {/* 화면 및 게임 공간 */}
          <div className="h-[90%]">
            <WebRTC pochaId={PochaId!} propSocket={propSocket} />
          </div>
          <div className="fixed -bottom-2 left-0 right-0">
            {socket && <RoomFooterNav pochaId={PochaId!} socket={socket} />}
          </div>
        </div>
      )}
    </>
  );
}
export default StoryRoom;
