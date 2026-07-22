/*
import React, { useEffect } from "react";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import LoadingScreen from "../components/LoadingScreen";

export default function Splash() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/home");
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <LoadingScreen />
    </>
  );
}
*/

import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import LoadingScreen from "../components/LoadingScreen";

export default function Splash() {
  const [canSwipe, setCanSwipe] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanSwipe(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <LoadingScreen canSwipe={canSwipe} />
    </>
  );
}