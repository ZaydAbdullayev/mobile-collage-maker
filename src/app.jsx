import React, { useState, useEffect } from "react";
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
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [fullScreen, setFullScreen] = useState(null);
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [collages, setCollages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [defaultCollage, setDefaultCollage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  useEffect(() => {
    if (!collages) {
      getCollages().then((result) => {
        setCollages(result);
        setLoading(false);
      });
    }
  }, [collages]);

  const changeActiveImageIndex = (step) => {
    const newIndex = activeImageIndex + step;
    const collageLength = collages?.[currentIndex]?.collage?.collage.length;
    if (collageLength) {
      setActiveImageIndex((newIndex + collageLength) % collageLength);
    }
  };

  const loadCollageImage = async (collage, title, index) => {
    try {
      setActiveImageIndex(null);
      setLoading(true);
      const imageBlob = await loadImage(collage?.composedId);
      setDefaultCollage({ src: URL.createObjectURL(imageBlob), title });
      setLoading(false);
      loadCollageImages(collage, index);
    } catch (error) {
      console.error("Error loading collage:", error);
    }
  };

  const loadCollageImages = async (collage, index) => {
    try {
      collage.collage.forEach(async (item, i) => {
        const imgBlob = await loadImage(item.id);
        collages[index].collage.collage[i].src = URL.createObjectURL(imgBlob);
        setCollages([...collages]);

        if (activeImageIndex === null) {
          setActiveImageIndex(i);
        }
      });
    } catch (error) {
      console.error("Error loading collage images:", error);
    }
  };

  const downloadActiveImage = () => {
    const activeImage =
      collages?.[currentIndex]?.collage?.collage?.[activeImageIndex]?.src;
    if (activeImage) {
      downloadImage(activeImage, "edited.png");
    }
  };

  const dropdownItems = [
    {
      key: "1",
      label: <span onClick={downloadActiveImage}>Save this photo</span>,
    },
    { type: "divider" },
    { key: "2", label: <span onClick={() => console.log()}>2 option</span> },
  ];

  const navMenu = [
    {
      key: "1",
      label: (
        <span
          onClick={() => console.log()}
          className="df aic"
          style={{ gap: "5px" }}>
          <TiUser /> Profile
        </span>
      ),
    },
  ];

  if (collages) {
    navMenu.push(
      { type: "divider" },
      {
        key: "2",
        type: "group",
        label: "My Collages",
        children: collages.map((collage, i) => ({
          key: collage?.id,
          label: (
            <span
              onClick={() => {
                loadCollageImage(collage?.collage, collage?.title, i);
                setCurrentIndex(i);
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
        <p>{defaultCollage?.title || "Home"}</p>
        <Dropdown
          menu={{ items: navMenu }}
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
        {loading ? (
          <span className="df aic gap5 loading">
            <BiLoaderCircle />
          </span>
        ) : (
          <div
            className={`df fww main-img-screen ${fullScreen && "full-screen"}`}
            style={{
              width: `${collages?.[currentIndex]?.collage?.boxSize?.w}px`,
              height: `${collages?.[currentIndex]?.collage?.boxSize?.h}px`,
              background: collages?.[currentIndex]?.collage?.boxSize?.bg,
            }}>
            {fullScreen ? (
              <div className="w100 df fdc full-mode">
                <div
                  className={`w100 df aic jcsb full-mode-title ${
                    fullScreenMode && "active"
                  }`}>
                  <span
                    className="df aic jcc close-full-screen"
                    onClick={() => setFullScreen(null)}>
                    <RxCross2 />
                  </span>
                  <big>
                    {activeImageIndex + 1} -{" "}
                    {collages?.[currentIndex]?.collage?.collage?.length}
                  </big>
                  <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
                    <Dropdown
                      menu={{ items: dropdownItems }}
                      placement="bottomRight"
                      trigger={["click"]}>
                      <span className="df aic jcc drop-down">
                        <PiDotsThreeCircleLight />
                      </span>
                    </Dropdown>
                  </ConfigProvider>
                </div>
                <figure className="w100 df aic jcc active-img">
                  <span onClick={() => changeActiveImageIndex(-1)}></span>
                  {collages?.[currentIndex]?.collage?.collage?.[
                    activeImageIndex
                  ]?.src ? (
                    <img
                      src={
                        collages?.[currentIndex]?.collage?.collage?.[
                          activeImageIndex
                        ]?.src
                      }
                      style={{
                        filter: collages?.[currentIndex]?.collage?.collage?.[
                          activeImageIndex
                        ]?.filter?.map(
                          (filter) =>
                            `${filter?.value}(${filter?.number}${filter?.unit})`
                        ),
                        userSelect: "none",
                      }}
                      alt="Img"
                      onClick={() => setFullScreenMode(!fullScreenMode)}
                    />
                  ) : (
                    <span className="df aic gap5 loading small">
                      <BiLoaderCircle />
                    </span>
                  )}
                  <span onClick={() => changeActiveImageIndex(1)}></span>
                </figure>
                <div
                  className={`w100 df aic selected-imgs ${
                    fullScreenMode && "active"
                  }`}>
                  {collages[currentIndex].collage?.collage?.map((item, idx) => (
                    <figure
                      key={idx}
                      className={`df aic jcc ${
                        activeImageIndex === idx ? "active" : ""
                      }`}
                      onClick={() => setActiveImageIndex(idx)}>
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
            ) : defaultCollage ? (
              <figure
                className="default-collage"
                onClick={() => {
                  setFullScreen(true);
                  setFullScreenMode(true);
                  if (defaultCollage?.title) setActiveImageIndex(0);
                }}>
                <img src={defaultCollage?.src} alt="collage" />
              </figure>
            ) : (
              <Result
                status="403"
                title="Select a collage"
                subTitle="Select any collage to view the collage"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
