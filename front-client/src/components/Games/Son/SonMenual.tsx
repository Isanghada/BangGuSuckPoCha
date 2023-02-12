import styles from "./SonMenual.module.css";
import { useState, useRef, useEffect } from "react";
import PublicModal from "src/components/Common/PublicModal";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import { showRouletteResultModal } from "src/store/store";

function SonMenual({
  socket,
  pochaId,
  pochaUsers,
}: {
  socket: any;
  pochaId: string;
  pochaUsers: any;
}): React.ReactElement {
  const dispatch = useAppDispatch();
  // Public모달 데이터
  const [modalData, setModalData] = useState<any>(null);
  // 방 이름
  const roomName = pochaId;
  // 메뉴얼 클릭
  const menual = true;
  // const startRoulette = () => {
  //   console.log("서버로 손병호가냐?")
  //   const roomName = pochaId;
  //   console.log("랜덤값");
  //   socket.emit("game_roulette", roomName);
  // }

  const onClickClose = () => {
    // 선택창으로 돌아가기
    socket.emit("game_son_signal", roomName);
  };

  return (
    <div className={`${styles.layout3}`}>
      <div className={`${styles.titlespan}`}>손병호 게임</div>
      <div className={`${styles.ladderForm} ${styles.layout}`}>
        <div className={`${styles.box} ${styles.layout2}`}>
          <div className={`${styles.smalltitlespan}`}>게임 방법</div>
          <div>
            <span className={`${styles.text1}`}>
              모든 사람이 손을 펴고 시작합니다.
              <br />
              <br />
              한 사람씩 돌아가며 조건을 외칩니다.
              <br />
              :: “안경 낀 사람 접어!”
              <br />
              <br />
              해당되는 사람은 손가락을 하나씩 접습니다.
              <br />
              <br />
              가장 먼저 손가락이 다 접힌 사람이 벌칙!
            </span>
          </div>
        </div>
        <div className={`${styles.layout3}`}>
          <input type="button" onClick={onClickClose} className={`${styles.retry}`} value="BACK" />
        </div>
      </div>
    </div>
  );
}

export default SonMenual;
