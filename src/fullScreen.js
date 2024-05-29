import React, { useState } from "react";
import { RxEnterFullScreen, RxExitFullScreen } from "react-icons/rx";

export const FullScreen = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          setIsFullScreen(true);
        })
        .catch((error) => {
          console.error("Tam ekran modu geçişinde hata oluştu:", error);
        });
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullScreen(false);
        })
        .catch((error) => {
          console.error("Tam ekran modundan çıkışta hata oluştu:", error);
        });
    }
  };

  return (
    <i onClick={toggleFullScreen} className="df aic jcc drop-down">
      {isFullScreen ? <RxExitFullScreen /> : <RxEnterFullScreen />}
    </i>
  );
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

// const collage = await loadCollage(c);
// if (collage == null) {
//   setEmty("Not found images belonging to this collage.");
// } else {
//   setActiveC({ ...collage, title });
//   setDisabled(true);
// }
