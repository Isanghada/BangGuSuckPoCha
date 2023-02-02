import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LoginLoading(): React.ReactElement {
  const navigate = useNavigate();
  useEffect(() => {
    //지금 현재 주소 가져오기
    const urlStr = window.location.href;
    // console.log("urlStr : " + urlStr);
    const url = new URL(urlStr);
    const urlParams = url.searchParams;

    const Auth: any = urlParams.get("Auth");
    // console.log("Auth : " + Auth);

    const Refresh: any = urlParams.get("Refresh");
    // console.log("Refresh : " + Refresh);

    const Role: any = urlParams.get("Role");

    const Username: any = urlParams.get("Username");
    // console.log("Username : " + Username);

    // Auth : eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxcnZ2d29Wb2h3T2xuOUpFbkdtd1lGNzBfOUt3LVprQk0xN2tpY3gzSGRZIiwiZXhwIjoxNjc1MTgxMTU3LCJ1c2VySWQiOjMsInVzZXJuYW1lIjoiMXJ2dndvVm9od09sbjlKRW5HbXdZRjcwXzlLdy1aa0JNMTdraWN4M0hkWSJ9.zk-eGoa1Q00e2HG3puEYN8-6v8S_KWXIDTJgFaBO2SXiYfg8yp5bBDetycTYkwDVpJSwVLpAGCDOracEbDhOOg

    // Refresh : eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxcnZ2d29Wb2h3T2xuOUpFbkdtd1lGNzBfOUt3LVprQk0xN2tpY3gzSGRZIiwiZXhwIjoxNjc1NzU4MzM3LCJ1c2VySWQiOjMsInVzZXJuYW1lIjoiMXJ2dndvVm9od09sbjlKRW5HbXdZRjcwXzlLdy1aa0JNMTdraWN4M0hkWSJ9.AZxBF4n4LVmXsuduA5P-H8Xmlu5OiA65uaMNohfM-Nu_1fGnWMklURIXVPg_wPjKQ78RHkF30nogco8xfLH0Mg

    // Role : NEWBIE/USER/SECESSION/ADMIN

    // Username : "1rvvwoVohwOln9JEnGmwYF70_9Kw-ZkBM17kicx3HdY"

    //토큰을 로컬로 유지할 것인가 store에서 유지할 것인가 고민해봐야함
    if (Role === "NEWBIE") {
      localStorage.setItem("accessToken", Auth);
      localStorage.setItem("refreshToken", Refresh);
      localStorage.setItem("Username", Username);
      //뉴비는 mypage로 가라!
      navigate("/mypage");
    } else if (Role === "USER") {
      //기존유저
      localStorage.setItem("accessToken", Auth);
      localStorage.setItem("refreshToken", Refresh);
      localStorage.setItem("Username", Username);
      navigate("/main");
    } else if (Role === "SECESSION") {
      alert("탈퇴된 회원입니다.");
      navigate("/");
    } else if (Role === "ADMIN") {
      localStorage.setItem("accessToken", Auth);
      localStorage.setItem("refreshToken", Refresh);
      localStorage.setItem("Username", Username);
      navigate("/adminlogin");
    }
  }, []);

  return <div>loading중</div>;
}

export default LoginLoading;
