import React, { useCallback } from "react";

const useOnClickParams = () => {
  const handleClick = useCallback((buttonType, params) => {
    switch (buttonType) {
      case "save":
        return () => {
          console.log("save");
          // 저장 로직
        };

      case "cancel":
        return () => {
          console.log("cancel");
          // 취소 로직
        };

      case "print":
        return () => {
          console.log("print clicked");
          const style = document.createElement("style");
          style.innerHTML = `
              @media print {
                body * {
                  visibility: hidden;
                }
                #${params.targetId}, #${params.targetId} * {
                  visibility: visible;
                }
                #${params.targetId} {
                  position: absolute;
                  left: 0;
                  top: 0;
                }
              }
            `;
          document.head.appendChild(style);
          window.print();
          document.head.removeChild(style);
        };

      default:
        return () => {
          console.log("default");
          // 기본 로직
        };
    }
  }, []);

  return { handleClick };
};

export default useOnClickParams;
