// sayfa yuklendiginde  tam ekran modunu kullanarak tarayıcı arayüzlerini gizlemek istiyorum.
import { useEffect } from "react";

export const FullScreen = () => {
  useEffect(() => {
    document.documentElement.requestFullscreen();
    return () => document.exitFullscreen();
  }, []);

  return null;
};
