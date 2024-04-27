import img1 from "./images/FB_IMG_1646741748761.jpg";
import img2 from "./images/backiee-246922-landscape.jpg";
import img3 from "./images/eller.jpg";
import img4 from "./images/infinity-5194420.jpg";
import img5 from "./images/nature.jpg";
import img6 from "./images/photo_.jpg";
import img7 from "./images/photo_2023-06-11_23-17-40.jpg";

export const attachImageZoomService = (elementSelector) => {
  let isZoomed = false;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let scrollLeft = 0;
  let scrollTop = 0;
  const mainImgScreen = document.querySelector(elementSelector);

  if (!mainImgScreen) {
    console.error("Element not found with the provided selector.");
    return;
  }

  mainImgScreen.addEventListener("dblclick", handleDoubleClick);
  mainImgScreen.addEventListener("mousedown", handleMouseDown);
  mainImgScreen.addEventListener("mouseup", handleMouseUp);
  mainImgScreen.addEventListener("mousemove", handleMouseMove);

  function handleDoubleClick() {
    if (!isZoomed) {
      mainImgScreen.style.transform = "scale(2)"; // Fotoğrafı iki katına büyüt
      isZoomed = true;
    } else {
      mainImgScreen.style.transform = "scale(1)"; // Normal boyuta geri döndür
      isZoomed = false;
    }
  }

  function handleMouseDown(e) {
    isDragging = true;
    startX = e.pageX - mainImgScreen.offsetLeft;
    startY = e.pageY - mainImgScreen.offsetTop;
    scrollLeft = mainImgScreen.scrollLeft;
    scrollTop = mainImgScreen.scrollTop;
  }

  function handleMouseUp() {
    isDragging = false;
  }

  function handleMouseMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - mainImgScreen.offsetLeft;
    const y = e.pageY - mainImgScreen.offsetTop;
    const walkX = x - startX;
    const walkY = y - startY;
    mainImgScreen.scrollLeft = scrollLeft - walkX;
    mainImgScreen.scrollTop = scrollTop - walkY;
  }
};

export function downloadBase64Image(base64Data, fileName) {
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "image/jpeg" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadImage(url, filename) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
}

export function indirResim(resimUrl) {
  fetch(resimUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Resim indirilemedi.");
      }
      return response.blob();
    })
    .then((blob) => {
      // Blob'u indirme bağlantısı olarak kullanarak yeni bir a etiketi oluştur
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resim.jpg"); // İndirilen dosyanın adı
      document.body.appendChild(link);
      link.click();
    })
    .catch((error) => {
      console.error("Resim indirme hatası: ", error);
    });
}

export const imagesData = {
  boxSize: { h: 400, w: 400, bg: "#353535" },
  collage: [
    {
      h: 193.33333333333346,
      w: 257.99999999999994,
      x: 0,
      y: 0,
      z: 1,
      src: img1,
      src1: "https://images.squarespace-cdn.com/content/v1/5e90513ca74b5254da14cca1/1633220789736-8VI8FTX5EFLTMDFWOXBD/image-asset.jpeg",
      filter: [],
    },
    {
      h: 100,
      w: 96.00000000000013,
      x: -64.00000000000001,
      y: -3,
      z: 1,
      src: img2,
      srcr1:
        "https://i1.adis.ws/i/canon/get-inspired-landscape-photography-tips-7_bfef6b1240ed454ea1a37cb87cee94dc?$media-collection-half-dt-jpg$",
      filter: [],
    },
    {
      h: 165.3333333333333,
      w: 303.3333333333334,
      x: 135,
      y: 11,
      z: "3",
      src: img3,
      src1: "https://plus.unsplash.com/premium_photo-1676496046182-356a6a0ed002?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGF5c2FnZXMlMjBkZSUyMGNhbXBhZ25lfGVufDB8fDB8fHww",
      filter: [],
    },
    {
      h: 92.66666666666663,
      w: 100,
      x: 333,
      y: -358.6666666666667,
      z: "3",
      src: img4,
      src1: "https://media.istockphoto.com/id/537856787/fr/photo/paysage-de-la-toscane-vallonn%C3%A9es.jpg?s=170667a&w=0&k=20&c=31YMKTM0X4wblGu0hLYe5I_VMJIzuAbQ_fJkuW-nRvQ=",
      filter: [],
    },
    {
      h: 100,
      w: 100,
      x: 116,
      y: -231,
      z: "4",
      src: img5,
      src1: "https://media.istockphoto.com/id/641205724/fr/photo/val-dorcia-tuscany-italy.jpg?s=612x612&w=0&k=20&c=EXDGO89B_VNGrtVNlhII4PUyGzS8iyMhHioHaZjgsuM=",
      filter: [],
    },
    {
      h: 318.6666666666667,
      w: 296.6666666666667,
      x: -133,
      y: -341.6666666666667,
      z: "2",
      src: img6,
      src1: "https://thumbs.web.sapo.io/?W=800&H=0&delay_optim=1&epic=NWVkjPPUJLcDQRB2WV9q6QtgNjU3dCmVbkyB2DuvC+dRDTdxNdc+V/DVfrYyMDmAh4x4KRrqGCJdvIAKjXjKdadXAFgqoO2fW5yEynV8scfLkzc=",
      filter: [],
    },
    {
      h: 100,
      w: 100,
      x: -22,
      y: 0,
      z: "5",
      src: img7,
      src1: "https://www.rantapallo.fi/wp-content/uploads/2019/08/italia-toscana-maisema-ss.jpg",
      filter: [],
    },
  ],
};
