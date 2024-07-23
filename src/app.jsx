import React, { useState, useEffect, useRef } from "react";
import "./css/app.css";
import { downloadImage, getOrderBySize } from "./hooks";
import { getCollages, loadImage } from "./api";
// import html2canvas from "html2canvas";
import { Dropdown, ConfigProvider, theme, Result, Radio, Space } from "antd";
import { Divider } from "antd";
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
  const [collageImgs, setCollageImgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [defaultCollage, setDefaultCollage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(1);
  const abortControllerRef = useRef(null);
  const onChange = (e) => {
    setValue(e.target.value);
    setCollageImgs([]);
  };
  const handleOpenChange = (nextOpen, info) => {
    if (info.source === "trigger" || nextOpen) {
      setOpen(nextOpen);
    }
  };

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

  const loadCollageImage = async (collage, title, index, signal) => {
    try {
      setActiveImageIndex(null);
      setLoading(true);
      const imageBlob = await loadImage(collage?.composedId, signal);
      if (signal.aborted) return;
      setDefaultCollage({ src: URL.createObjectURL(imageBlob), title });
      setLoading(false);
      if (value === 1) {
        await loadCollageImagesByOrder(collage, index, signal);
      } else {
        await loadCollageImages(collage, index, signal);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.log("Error loading collage:", error);
      }
    }
  };

  const loadCollageImages = async (collage, index, signal) => {
    try {
      for (let i = 0; i < collage.collage.length; i++) {
        const item = collage.collage[i];
        if (item?.media) {
          const imgBlob = await loadImage(item.id, signal);
          if (signal.aborted) return;
          const mediaBlob = await loadImage(item.media[0]?.dlId, signal);
          if (signal.aborted) return;
          setCollageImgs((prev) => [
            ...prev,
            {
              ...collages[index].collage.collage[i],
              src: URL.createObjectURL(imgBlob),
              media_src: URL.createObjectURL(mediaBlob),
              exist_ind: i,
            },
          ]);
        } else {
          const imgBlob = await loadImage(item.id, signal);
          if (signal.aborted) return;
          setCollageImgs((prev) => [
            ...prev,
            {
              ...collages[index].collage.collage[i],
              src: URL.createObjectURL(imgBlob),
              exist_ind: i,
            },
          ]);
        }
        setCollages((prevCollages) => {
          const newCollages = [...prevCollages];
          newCollages[index] = {
            ...newCollages[index],
            collage: { ...newCollages[index].collage, collage: prevCollages[index].collage.collage },
          };
          return newCollages;
        });
        setActiveImageIndex((prev) => prev === null ? i : prev);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.log("Error loading collage images:", error);
      }
    }
  };

  const loadCollageImagesByOrder = async (collage, index, signal) => {
    try {
      const order = getOrderBySize(collage);
      for (const i of order) {
        if (i >= 0 && i < collage.collage.length) {
          const item = collage.collage[i];
          if (item?.media) {
            const imgBlob = await loadImage(item.id, signal);
            if (signal.aborted) return;
            const mediaBlob = await loadImage(item.media[0]?.dlId, signal);
            if (signal.aborted) return;
            setCollageImgs((prev) => [
              ...prev,
              {
                ...collages[index].collage.collage[i],
                src: URL.createObjectURL(imgBlob),
                media_src: URL.createObjectURL(mediaBlob),
                exist_ind: i,
              },
            ]);
          } else {
            const imgBlob = await loadImage(item.id, signal);
            if (signal.aborted) return;
            setCollageImgs((prev) => [
              ...prev,
              {
                ...collages[index].collage.collage[i],
                src: URL.createObjectURL(imgBlob),
                exist_ind: i,
              },
            ]);
          }
          setCollages((prevCollages) => {
            const newCollages = [...prevCollages];
            newCollages[index] = {
              ...newCollages[index],
              collage: { ...newCollages[index].collage, collage: prevCollages[index].collage.collage },
            };
            return newCollages;
          });
          setActiveImageIndex((prev) => prev === null ? i : prev);
        }
      }
      setActiveImageIndex((prev) => prev === null ? 0 : prev);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error("Error loading collage images:", error);
      }
    }
  };

  const handleLoadCollage = (collage, title, index) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    loadCollageImage(collage, title, index, abortControllerRef.current.signal);
  };

  const downloadActiveImage = () => {
    const activeImage = collageImgs?.[activeImageIndex]?.src;
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
          onClick={() => setOpen(false)}
          className="df aic"
          style={{ gap: "5px" }}>
          <TiUser /> Profile
        </span>
      ),
    },
    { type: "divider", paragraph: "sd" },
  ];

  if (collages) {
    navMenu.push(
      {
        key: "32",
        label: (
          <Radio.Group onChange={onChange} value={value}>
            <Divider
              orientation="left"
              plain
              orientationMargin="0"
              style={{ lineHeight: 0, marginTop: 6, fontSize: "12px" }}>
              Choose load type
            </Divider>
            <Space direction="vertical">
              <Radio value={1}>in order</Radio>
              <Radio value={2}>out of order</Radio>
            </Space>
          </Radio.Group>
        ),
      },
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
                handleLoadCollage(collage?.collage, collage?.title, i);
                setCurrentIndex(i);
                setOpen(false);
                setCollageImgs([]);
              }}>
              {collage?.title}
            </span>
          ),
        })),
      }
    );
  }

  console.log(collageImgs);
  console.log(collages?.[currentIndex]);
  const activeCollage = collages?.[currentIndex]?.collage;
  return (
    <div className="w100 df fdc aic wrapper">
      <nav className="w100 df aic navbar">
        <p>{defaultCollage?.title || "Home"}</p>
        <Dropdown
          menu={{ items: navMenu }}
          placement="bottomRight"
          trigger={["click"]}
          overlayClassName="nav-dropdown"
          onOpenChange={handleOpenChange}
          open={open}>
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
              width: `${activeCollage?.boxSize?.w}px`,
              height: `${activeCollage?.boxSize?.h}px`,
              background: activeCollage?.boxSize?.bg,
            }}>
            {fullScreen ? (
              <div className="w100 df fdc full-mode">
                  <div className={`w100 df aic jcsb full-mode-title ${fullScreenMode && "active"}`}>
                  <span
                    className="df aic jcc close-full-screen"
                    onClick={() => setFullScreen(null)}>
                    <RxCross2 />
                  </span>
                  <big>
                    {activeImageIndex + 1} - {activeCollage?.collage?.length}
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
                  {activeImage(
                    collageImgs?.[activeImageIndex]?.media?.[0]?.type,
                    collageImgs?.[activeImageIndex],
                    fullScreen,
                    setFullScreen
                  )}

                  <span onClick={() => changeActiveImageIndex(1)}></span>
                </figure>
                  <div className={`w100 df aic selected-imgs ${fullScreenMode && "active"}`}>
                  {collageImgs?.map((item, idx) => (
                    <figure
                      key={idx}
                      className={`df aic jcc ${activeImageIndex === idx ? "active" : ""}`}
                      onClick={() => setActiveImageIndex(idx)}>
                      {activeImage(
                        item?.media?.[0]?.type,
                        item,
                        fullScreen,
                        setFullScreen,
                        true
                      )}
                      <i></i>
                    </figure>
                  ))}
                  <figure
                    className={`df aic jcc `}
                      style={{ display: collageImgs?.length === activeCollage?.collage?.length ? "none" : "flex", }}>
                    <span className="df aic gap5 loading small">
                      <BiLoaderCircle />
                    </span>
                  </figure>
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

const activeImage = (type, collage, f, setF, under = false) => {
  switch (type) {
    case "video":
      return collage?.media_src ? (
        <video controls={!under} autoPlay={!under} src={collage?.media_src} />
      ) : (
        <span className="df aic gap5 loading small">
          <BiLoaderCircle />
        </span>
      );
    case "audio":
      return collage?.media_src ? (
        <>
          <img
            src={collage?.src}
            style={{
              filter: collage?.filter?.map(
                (filter) => `${filter?.value}(${filter?.number}${filter?.unit})`
              ),
              userSelect: "none",
            }}
            alt="Img"
            onClick={() => setF(!f)}
          />
          {!under && (
            <audio
              controls
              autoPlay
              src={collage?.media_src}
              style={{ display: "none" }}
            />
          )}
        </>
      ) : (
        <span className="df aic gap5 loading small">
          <BiLoaderCircle />
        </span>
      );
    default:
      return collage?.src ? (
        <img
          src={collage?.src}
          style={{
            filter: collage?.filter?.map(
              (filter) => `${filter?.value}(${filter?.number}${filter?.unit})`
            ),
            userSelect: "none",
          }}
          alt="Img"
          onClick={() => setF(!f)}
        />
      ) : (
        <span className="df aic gap5 loading small">
          <BiLoaderCircle />
        </span>
      );
  }
};
