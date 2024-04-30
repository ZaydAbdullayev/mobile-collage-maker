import React, { memo } from "react";
import "./loading.css";
import { BiLoaderCircle } from "react-icons/bi";

export const Loading = memo(() => {
  return (
    <div className="w100 df aic jcc loading_box">
      <BiLoaderCircle />
    </div>
  );
});
