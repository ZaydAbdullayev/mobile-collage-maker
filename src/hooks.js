import img1 from "./images/FB_IMG_1646741748761.jpg";
import img2 from "./images/backiee-246922-landscape.jpg";
import img3 from "./images/eller.jpg";
import img4 from "./images/infinity-5194420.jpg";
import img5 from "./images/nature.jpg";
import img6 from "./images/photo_.jpg";
import img7 from "./images/photo_2023-06-11_23-17-40.jpg";

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

export const imagesData1 = {
  boxSize: { h: 660, w: 400, bg: "#353535" },
  collage: [
    {
      unit: "px",
      w: 191.33333333333312,
      x: 2.6666666666666146,
      y: -20,
      z: "2",
      h: 178,
      number: 189,
      src: "https://images.squarespace-cdn.com/content/v1/5e90513ca74b5254da14cca1/1633220789736-8VI8FTX5EFLTMDFWOXBD/image-asset.jpeg",
      filter: [],
    },
    {
      h: 120,
      w: 180,
      x: 14.999999999999979,
      y: 50,
      z: "2",
      src: "https://pics.craiyon.com/2023-07-11/f1abc370495f4060869a77b6e5c568d9.webp",
      filter: [],
    },
    {
      h: 177.99999999999997,
      w: 220,
      x: -39,
      y: 143,
      z: "2",
      src: "https://darakchi.uz/storage/f7/dd/ba/57515/conversions/UWJS1iV6UqNgG9Qf6mHrrFGWITLIwu_q-xl.jpg",
      filter: [],
    },
    {
      h: 120,
      w: 120,
      x: -17,
      y: 350,
      z: "2",
      src: "https://media.istockphoto.com/id/537856787/fr/photo/paysage-de-la-toscane-vallonn%C3%A9es.jpg?s=170667a&w=0&k=20&c=31YMKTM0X4wblGu0hLYe5I_VMJIzuAbQ_fJkuW-nRvQ=",
      filter: [],
    },
    {
      h: 296.00000000000006,
      w: 190.66666666666652,
      x: 204.33333333333334,
      y: -160.00000000000003,
      z: "2",
      src: "https://media.istockphoto.com/id/641205724/fr/photo/val-dorcia-tuscany-italy.jpg?s=612x612&w=0&k=20&c=EXDGO89B_VNGrtVNlhII4PUyGzS8iyMhHioHaZjgsuM=",
      filter: [],
    },
    {
      h: 89.99999999999991,
      w: 91.33333333333327,
      x: -193,
      y: -177,
      z: "2",
      src: "https://thumbs.web.sapo.io/?W=800&H=0&delay_optim=1&epic=NWVkjPPUJLcDQRB2WV9q6QtgNjU3dCmVbkyB2DuvC+dRDTdxNdc+V/DVfrYyMDmAh4x4KRrqGCJdvIAKjXjKdadXAFgqoO2fW5yEynV8scfLkzc=",
      filter: [],
    },
    {
      h: 120,
      w: 120,
      x: 114,
      y: -462,
      z: "2",
      src: "https://www.rantapallo.fi/wp-content/uploads/2019/08/italia-toscana-maisema-ss.jpg",
      filter: [],
    },
    {
      h: 660,
      w: 444.00000000000034,
      x: 1,
      y: -769,
      z: "1",
      src: "https://i.pinimg.com/236x/51/99/bd/5199bdea114e830e19d65986553c6fc2.jpg",
      filter: [],
    },
    {
      h: 99.33333333333331,
      w: 155.33333333333317,
      x: 15,
      y: -886.3333333333333,
      z: 1,
      src: "https://media.istockphoto.com/id/641205724/fr/photo/val-dorcia-tuscany-italy.jpg?s=612x612&w=0&k=20&c=EXDGO89B_VNGrtVNlhII4PUyGzS8iyMhHioHaZjgsuM=",
      filter: [],
    },
  ],
};
