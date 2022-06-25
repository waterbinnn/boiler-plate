import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

function LandingPage(props) {
  const navigate = useNavigate();

  useEffect(() => {
    Axios.get("/api/hello").then((response) => {
      console.log(response);
    });
  }, []);

  const onClickHandler = () => {
    Axios.get("api/users/logout").then((response) => {
      if (response.data.success) {
        navigate("/login");
      } else {
        alert("실패");
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <h2>시작 페이지</h2>

      <button onClick={onClickHandler}> </button>
    </div>
  );
}

export default LandingPage;
