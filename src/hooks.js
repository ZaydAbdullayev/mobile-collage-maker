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
