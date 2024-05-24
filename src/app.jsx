import React, { useState } from "react";
import "./css/app.css";
import { downloadImage } from "./hooks";
import { getCollages, loadCollage, loadImage } from "./api";
// import html2canvas from "html2canvas";
import { Dropdown, ConfigProvider, theme, Result } from "antd";

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
  const [dfCollage, setDfCollage] = useState(null);
  const [emty, setEmty] = useState("");
  console.log(collages);
  console.log(activeC);

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
      const sd = await loadImage(c?.composedId);
      setDfCollage(window.URL.createObjectURL(sd));
      setLoading(false);
      const collage = await loadCollage(c);
      if (collage == null) {
        setEmty("Not found images belonging to this collage.");
      } else {
        setActiveC({ ...collage, title });
      }
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
                        <img
                          src={item.src}
                          style={{
                            filter: item?.filter.map(
                              (filter) =>
                                `${filter?.value}(${filter?.number}${filter?.unit})`
                            ),
                            userSelect: "none",
                          }}
                          alt="Edited"
                        />
                        <i></i>
                      </figure>
                    ))}
                  </div>
                </div>
              ) : dfCollage ? (
                <figure
                  className="default-collage"
                  onClick={() => {
                    setFullS(true);
                    setActiveImg(0);
                    setFullSS(true);
                  }}>
                  <img src={dfCollage} alt="collage" />
                </figure>
              ) : (
                <Result
                  status="403"
                  title="Select a collage"
                  subTitle="Select any collage to view the collage"
                />
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
