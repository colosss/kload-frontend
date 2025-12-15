import './button_handler.css'
import type { ReactNode, MouseEvent, CSSProperties } from 'react'
import "./Page_bar.css"


// type PageBarProps = {
//   currentPage: number;
//   onNext: () => void;
//   onPrev: () => void;
// };

// export default function Page_bar({
//   currentPage,
//   onNext,
//   onPrev
// }: PageBarProps) {

//     return (
//         <div className="bar_row">
//             <button className="bar_button" onClick={onPrev}>
//                 {"<"}
//             </button>
//             <div className="bar_page">
//                 {currentPage}
//             </div>
//             <button className="bar_button" onClick={onNext}>
//                 {">"}
//             </button>
//         </div>
//     )
// }

type PageBarProps = {
  currentPage: number;
  onNext: () => void;
  onPrev: () => void;
  isNextDisabled: boolean;
  isPrevDisabled: boolean;
};
export default function Page_bar({
  currentPage,
  onNext,
  onPrev,
  isNextDisabled,
  isPrevDisabled,
}: PageBarProps) {
  return (
    <div className="bar_row">
      <button className="bar_button" onClick={onPrev} disabled={isPrevDisabled}>
        {"<"}
      </button>
      <div className="bar_page">
        {currentPage}
      </div>
      <button className="bar_button" onClick={onNext} disabled={isNextDisabled}>
        {">"}
      </button>
    </div>
  );
}

