import React, { useEffect, useState } from "react";

export function useRadioParams() {
  const { heavyRadio } = useHeavyParams(); // 구조 분해 할당으로 함수만 추출

  return {
    heavyRadio,
  };
}

const useHeavyParams = () => {
  const [useHeavy, setUseHeavy] = useState(false);

  const heavyRadio = (e) => {
    setUseHeavy(e.target.value === "use");
  };

  useEffect(() => {
    const element = document.getElementById("heavy__div");
    if (element) {
      const hasClass = element.classList.contains("runtime-hidden");

      if (useHeavy && hasClass) {
        element.classList.remove("runtime-hidden");
      } else if (!useHeavy && !hasClass) {
        element.classList.add("runtime-hidden");
      }
    }
  }, [useHeavy]);

  return { heavyRadio };
};
