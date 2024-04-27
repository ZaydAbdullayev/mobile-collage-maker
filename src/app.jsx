import React, { useState, useEffect } from "react";
import "./css/app.css";
import { imagesData, downloadImage, imagesData1 } from "./hooks";
// import html2canvas from "html2canvas";
import { Dropdown, ConfigProvider, theme,  } from "antd";

import { RxCross2 } from "react-icons/rx";
import { BsThreeDots } from "react-icons/bs";
import { PiDotsThreeCircleLight } from "react-icons/pi";
import { TiUser } from "react-icons/ti";
import { FullScreen } from "./foolScreen";
import { HiOutlineMenu } from "react-icons/hi";


export const App = () => {
  const [activeImg, setActiveImg] = useState(null);
  const [fullS, setFullS] = useState(null);
  const [fullSS, setFullSS] = useState(false);
  const [activeC, setActiveC] = useState(0);

  const changeActiveImg = (i) => {
    const newIndex = activeImg + i;
    if (newIndex >= 0 && newIndex < imagesData.collage.length) {
      setActiveImg(newIndex);
    } else {
      setActiveImg(
        (newIndex + imagesData.collage.length) % imagesData.collage.length
      );
    }
  };


  // const downloadImagesToDevice = () => {
  //   const mainImgScreen = document.querySelector(".main-img-screen");
  //   html2canvas(mainImgScreen).then((canvas) => {
  //     canvas.toBlob((blob) => {
  //       const imageUrl = URL.createObjectURL(blob);
  //       const link = document.createElement("a");
  //       link.href = imageUrl;
  //       link.setAttribute("download", "collage.png");
  //       link.click();
  //       URL.revokeObjectURL(imageUrl);
  //     });
  //   });
  // };

  const collages = [
    {
      id: 11,
      title: "1st collage",
      collage: imagesData,
    },
    {
      id: 22,
      title: "2nd collage",
      collage: imagesData1,
    },
    {
      id: 33,
      title: "3rd collage",
      collage: imagesData,
    },
  ];

  const items = [
    {
      key: "1",
      label: (
        <span
          onClick={() => {
            downloadImage(
              collages[activeC].collage.collage[activeImg].src,
              "edited.png"
            );
          }}>
          Coxpaни это фото
        </span>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: <span onClick={() => console.log()}>2 option</span>,
    },
  ];

  const navMenu = [
    {
      key: "1",
      label: (
        <span
          onClick={() => console.log()}
          className="df aic"
          style={{ gap: "5px" }}>
          <TiUser />
          Профиль
        </span>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "2",
      type: "group",
      label: "Moи коллажи",
      children: collages.map((collage, ind) => ({
        key: collage.id,
        label: <span onClick={() => setActiveC(ind)}>{collage.title}</span>,
      })),
    },
  ];

  return (
    <div className="w100 df fdc aic wrapper">
      <nav className="w100 df aic navbar">
        <p>{activeC !== null ? collages[activeC].title : "Главная"}</p>
        <Dropdown
          menu={{ items: navMenu, selectable: true }}
          placement="bottomRight"
          trigger={["click"]}
          overlayClassName="nav-dropdown">
          <span className="df aic jcc drop-down">
            <HiOutlineMenu />
          </span>
        </Dropdown>
        <FullScreen />
      </nav>
      <div className="w100 df aic jcc main">
        <div
          className={`df fww main-img-screen ${fullS && "full-screen"}`}
          style={{
            width: collages[activeC].collage.boxSize.w,
            height: collages[activeC].collage.boxSize.h,
            background: collages[activeC].collage.boxSize.bg,
          }}>
          {fullS ? (
            <div className="w100 df fdc full-mode">
              <div
                className={`w100 df aic jcsb full-mode-title ${
                  fullSS && "active"
                }`}>
                <span
                  className="df aic jcc close-full-screen"
                  onClick={() => setFullS(null)}>
                  <RxCross2 />
                </span>
                <big>
                  {activeImg + 1} - {collages[activeC].collage.collage.length}
                </big>
                <ConfigProvider
                  theme={{
                    algorithm: theme.darkAlgorithm,
                  }}>
                  <Dropdown
                    menu={{
                      items,
                    }}
                    placement="bottomRight"
                    trigger={["click"]}>
                    <span className="df aic jcc drop-down">
                      <PiDotsThreeCircleLight />
                    </span>
                  </Dropdown>
                </ConfigProvider>
              </div>
              <figure className="w100 df aic active-img">
                <span onClick={() => changeActiveImg(-1)}></span>
                <img
                  src={collages[activeC].collage.collage[activeImg].src}
                  alt="Img"
                  onClick={() => setFullSS(!fullSS)}
                />
                <span onClick={() => changeActiveImg(+1)}></span>
              </figure>
              <div
                className={`w100 df aic selected-imgs ${fullSS && "active"}`}>
                {collages[activeC]?.collage?.collage?.map((item, ind) => (
                  <figure
                    key={ind}
                    className={`${activeImg === ind && "active"}`}
                    onClick={() => setActiveImg(ind)}>
                    <img src={item.src} alt="Edited" />
                  </figure>
                ))}
              </div>
            </div>
          ) : (
            collages[activeC]?.collage?.collage?.map((item, ind) => (
              <figure
                className={`img-label ${activeImg === ind && "active"}`}
                key={ind}
                style={{
                  top: item.y,
                  left: item.x,
                  width: item.w,
                  height: item.h,
                  zIndex: item.z,
                }}>
                <img
                  src={item.src}
                  alt="Edited"
                  onClick={() => {
                    setFullS(true);
                    setActiveImg(ind);
                    setFullSS(true);
                  }}
                  style={{
                    filter: item.filter.map(
                      (filter) =>
                        `${filter.value}(${filter.number}${filter.unit})`
                    ),
                    userSelect: "none",
                  }}
                />
              </figure>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
