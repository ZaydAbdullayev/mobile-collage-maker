import React, { useState } from "react";
import "./css/app.css";
import { downloadImage } from "./hooks";
import { getCollages, loadCollage } from "./api";
// import html2canvas from "html2canvas";
import { Dropdown, ConfigProvider, theme } from "antd";

import { RxCross2 } from "react-icons/rx";
import { BiLoaderCircle } from "react-icons/bi";
import { PiDotsThreeCircleLight } from "react-icons/pi";
import { TiUser } from "react-icons/ti";
import { FullScreen } from "./fullScreen";
import { HiOutlineMenu } from "react-icons/hi";

export const App = () => {
  const [activeImg, setActiveImg] = useState(null);
  const [fullS, setFullS] = useState(null);
  const [fullSS, setFullSS] = useState(false);
  const [collages, setCollages] = useState(null);
  const [activeC, setActiveC] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emty, setEmty] = useState("");

  const changeActiveImg = (i) => {
    const newIndex = activeImg + i;
    if (newIndex >= 0 && newIndex < activeC?.collage.length) {
      setActiveImg(newIndex);
    } else {
      setActiveImg(
        (newIndex + activeC?.collage.length) % activeC?.collage.length
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

  if (!collages)
    getCollages().then((result) => {
      setCollages(result);
      setLoading(false);
    });

  const getCollageImg = async (c, title) => {
    try {
      setLoading(true);
      const collage = await loadCollage(c);
      if (collage == null)
        return setEmty("Not found images belonging to this collage.");
      setActiveC({ ...collage, title });
      setLoading(false);
    } catch (error) {
      console.error("Error loading collage:", error);
    }
  };

  const items = [
    {
      key: "1",
      label: (
        <span
          onClick={() => {
            if (collages && collages[activeC])
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
  ];

  if (collages) {
    navMenu.push(
      {
        type: "divider",
      },
      {
        key: "2",
        type: "group",
        label: "Moи коллажи",
        children: collages?.map((collage) => ({
          key: collage?.id,
          label: (
            <span
              onClick={() => getCollageImg(collage?.collage, collage?.title)}>
              {collage?.title}
            </span>
          ),
        })),
      }
    );
  }

  return (
    <div className="w100 df fdc aic wrapper">
      <nav className="w100 df aic navbar">
        <p>{activeC?.length !== 0 ? activeC?.title : "Главная"}</p>
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
        {!loading ? (
          emty ? (
            emty
          ) : (
            <div
              className={`df fww main-img-screen ${fullS && "full-screen"}`}
              style={{
                width: `${activeC?.boxSize?.w}px`,
                height: `${activeC?.boxSize?.h}px`,
                background: activeC?.boxSize?.bg,
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
                      {activeImg + 1} - {activeC?.collage?.length}
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
                      src={activeC?.collage?.[activeImg].src}
                      alt="Img"
                      onClick={() => setFullSS(!fullSS)}
                    />
                    <span onClick={() => changeActiveImg(+1)}></span>
                  </figure>
                  <div
                    className={`w100 df aic selected-imgs ${
                      fullSS && "active"
                    }`}>
                    {activeC?.collage?.map((item, ind) => (
                      <figure
                        key={ind}
                        className={`${activeImg === ind && "active"}`}
                        onClick={() => setActiveImg(ind)}>
                        <img src={item.src} alt="Edited" />
                        <i></i>
                      </figure>
                    ))}
                  </div>
                </div>
              ) : (
                activeC?.collage?.map((item, ind) => (
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
          )
        ) : (
          <span className="df aic gap5 loading">
            <BiLoaderCircle />
          </span>
        )}
      </div>
    </div>
  );
};
