import { StandardTable1 } from "./StandardTable1";
import { StandardTable2 } from "./StandardTable2";
import { StandardTable3 } from "./StandardTable3";

export const AllTable = () => {
    return (
        <div className="d-flex flex-column">
          {/* 위험성(사고 발생)이 예상되는 가능성 판단 */}
          <StandardTable1 />
          
          {/* 위험성 판정 평가표 */}
          <StandardTable2 />

          {/* 개선 필요사항에 대한 코드부여 */}
          <StandardTable3 />
        </div>
    );
  };