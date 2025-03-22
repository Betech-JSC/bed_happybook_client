"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import "@/styles/AppLoader.scss";
import { translatePage } from "@/utils/translateDom";
import Image from "next/image";

const AppLoader: React.FC = () => {
  const pathName = usePathname();
  // const { isLoading } = useLoading();

  useEffect(() => {
    translatePage();
  }, [pathName]);

  return null;
  // if (!isLoading) return null;

  return (
    <></>
    // <div
    //   id="wrapper-app-global-loader"
    //   className={!isLoading ? "opacity-0 invisible" : ""}
    // >
    //   <div className="mx-auto">
    //     <Image
    //       priority
    //       key={pathName}
    //       src={`/loading.gif`}
    //       alt="Loading"
    //       width={900}
    //       height={900}
    //       unoptimized
    //       style={{ height: 900 }}
    //     />
    //   </div>
    // </div>
  );
};

export default AppLoader;
