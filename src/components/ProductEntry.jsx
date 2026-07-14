import { useMemo } from "react";
import "./ProductEntry.css";

const ProductEntry = ({
  className = "",
  image2,
  prop,
  soldStatusWidth,
  divMinWidth,
}) => {
  const isSoldOut = prop === "품절";

  const statusWrapperStyle = useMemo(() => {
    return {
      width: soldStatusWidth,
    };
  }, [soldStatusWidth]);

  const divStyle = useMemo(() => {
    return {
      minWidth: divMinWidth,
    };
  }, [divMinWidth]);

  return (
    <div className={`media-block ${isSoldOut ? "is-soldout" : ""} ${className}`}>
      <div className="image-2-container">
        <img className="image-2-icon3" loading="lazy" alt="" src={image2} />
        
        {isSoldOut ? (
          /* 품절 오버레이 */
          <div className="soldout-overlay">품절</div>
        ) : (
          /* 검은색 딤처리 둥근 프레임 배지 */
          <div className="status-wrapper" style={statusWrapperStyle}>
            <div className="div11" style={divStyle}>
              {prop}
            </div>
          </div>
        )}
      </div>
      
      <div className="detail-block">
        <div className="div12">맛있는 빵집</div>
        <div className="div13">미피 구운빵</div>
        <div className="price-main-parent">
          <span className="price-main">34%</span>
          <span className="price-extra">1800</span>
        </div>
      </div>
    </div>
  );
};

export default ProductEntry;