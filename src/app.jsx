import React, { useState } from "react";
import "./css/app.css";
import { downloadImage } from "./hooks";
import { getCollages, loadImage } from "./api";
// import html2canvas from "html2canvas";
import { Dropdown, ConfigProvider, theme, Result } from "antd";

import { RxCross2 } from "react-icons/rx";
import { BiLoaderCircle } from "react-icons/bi";
import { PiDotsThreeCircleLight } from "react-icons/pi";
import { TiUser } from "react-icons/ti";
import { FullScreen } from "./fullScreen";
import { HiOutlineMenu } from "react-icons/hi";

export const App = () => {
  const [activeImgInd, setActiveImgInd] = useState(null);
  const [fullS, setFullS] = useState(null);
  const [fullSS, setFullSS] = useState(false);
  const [collages, setCollages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dfCollage, setDfCollage] = useState(null);
  const [ind, setInd] = useState(null);

  const changeActiveImgInd = (i) => {
    const newIndex = activeImgInd + i;
    if (newIndex >= 0 && newIndex < collages?.[ind]?.collage?.collage.length) {
      setActiveImgInd(newIndex);
    } else {
      setActiveImgInd(
        (newIndex + collages?.[ind]?.collage?.collage.length) %
          collages?.[ind]?.collage?.collage.length
      );
    }
  };

  if (!collages)
    getCollages().then((result) => {
      setCollages(result);
      setLoading(false);
    });

  const getCollageImg = async (c, title, i) => {
    try {
      setActiveImgInd(null);
      setLoading(true);
      const sd = await loadImage(c?.composedId);
      setDfCollage({ src: window.URL.createObjectURL(sd), title });
      setLoading(false);
      getCollageImgs(c, i);
    } catch (error) {
      console.error("Error loading collage:", error);
    }
  };

  const getCollageImgs = async (c, i) => {
    try {
      c.collage.forEach(async (item, index) => {
        const img = await loadImage(item.id).then((res) =>
          window.URL.createObjectURL(res)
        );
        if (img?.length > 0) {
          collages[i].collage.collage[index].src = img;
          if (!collages?.[ind]?.collage?.collage?.[activeImgInd]?.src) {
            setActiveImgInd(index);
          }
          setCollages(collages);
        }
      });
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
            if (
              collages &&
              collages?.[ind]?.collage?.collage?.[activeImgInd]?.src
            )
              downloadImage(
                collages?.[ind]?.collage?.collage?.[activeImgInd]?.src,
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
        children: collages?.map((collage, ind) => ({
          key: collage?.id,
          label: (
            <span
              onClick={() => {
                getCollageImg(collage?.collage, collage?.title, ind);
                setInd(ind);
              }}>
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
        <p>{dfCollage?.title ? dfCollage?.title : "Главная"}</p>
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
          <div
            className={`df fww main-img-screen ${fullS && "full-screen"}`}
            style={{
              width: `${collages?.[ind]?.collage?.boxSize?.w}px`,
              height: `${collages?.[ind]?.collage?.boxSize?.h}px`,
              background: collages?.[ind]?.collage?.boxSize?.bg,
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
                    {activeImgInd + 1} -{" "}
                    {collages?.[ind]?.collage?.collage?.length}
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
                <figure className="w100 df aic jcc active-img">
                  <span onClick={() => changeActiveImgInd(-1)}></span>
                  {collages?.[ind]?.collage?.collage?.[activeImgInd]?.src ? (
                    <img
                      src={
                        collages?.[ind]?.collage?.collage?.[activeImgInd]?.src
                      }
                      style={{
                        filter: collages?.[ind]?.collage?.collage?.[
                          activeImgInd
                        ]?.filter?.map(
                          (filter) =>
                            `${filter?.value}(${filter?.number}${filter?.unit})`
                        ),
                        userSelect: "none",
                      }}
                      alt="Img"
                      onClick={() => setFullSS(!fullSS)}
                    />
                  ) : (
                    <span className="df aic gap5 loading small">
                      <BiLoaderCircle />
                    </span>
                  )}
                  <span onClick={() => changeActiveImgInd(+1)}></span>
                </figure>
                <div
                  className={`w100 df aic selected-imgs ${fullSS && "active"}`}>
                  {collages[ind].collage?.collage?.map((item, idx) => (
                    <figure
                      key={idx}
                      className={`df aic jcc ${
                        activeImgInd === idx ? "active" : ""
                      }`}
                      onClick={() => setActiveImgInd(idx)}>
                      {item?.src ? (
                        <img
                          src={item?.src}
                          style={{
                            filter: item?.filter.map(
                              (filter) =>
                                `${filter?.value}(${filter?.number}${filter?.unit})`
                            ),
                            userSelect: "none",
                          }}
                          alt="Edited"
                        />
                      ) : (
                        <span className="df aic gap5 loading small">
                          <BiLoaderCircle />
                        </span>
                      )}
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
                  setFullSS(true);
                  if (dfCollage?.title) {
                    setActiveImgInd(0);
                  }
                }}>
                <img src={dfCollage?.src} alt="collage" />
              </figure>
            ) : (
              <Result
                status="403"
                title="Select a collage"
                subTitle="Select any collage to view the collage"
              />
            )}
          </div>
        ) : (
          <span className="df aic gap5 loading">
            <BiLoaderCircle />
          </span>
        )}
      </div>
    </div>
  );
};
