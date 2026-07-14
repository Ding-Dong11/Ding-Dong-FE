import ProductEntry from "./components/ProductEntry";
import "./sale.css"; 

// 프로젝트 에셋에서 토끼빵 이미지 로드
import miffyImg from "./assets/Miffy.png";
import AI from "./assets/AI.png";


const Sale = () => {
  return (
    <div className="sale">
      {/* 상단 타이틀 */}
      <h3 className="h3">7월 11일 할인상품</h3>
      
      {/* 2단 반응형 그리드 - 상품 카드 12개 배치 (스크롤 가능) */}
      <div className="product-grid">
        <ProductEntry image2={miffyImg} prop="1개 남음" />
        <ProductEntry image2={miffyImg} prop="12개 남음" />
        <ProductEntry image2={miffyImg} prop="3개 남음" />
        <ProductEntry image2={miffyImg} prop="품절" />
        <ProductEntry image2={miffyImg} prop="2개 남음" />
        <ProductEntry image2={miffyImg} prop="3개 남음" />
        <ProductEntry image2={miffyImg} prop="5개 남음" />
        <ProductEntry image2={miffyImg} prop="8개 남음" />
        <ProductEntry image2={miffyImg} prop="품절" />
        <ProductEntry image2={miffyImg} prop="1개 남음" />
        <ProductEntry image2={miffyImg} prop="7개 남음" />
        <ProductEntry image2={miffyImg} prop="품절" />
      </div>

      {/* 우측 하단 플로팅 스페이서 아이콘 */}
      <img
        className="spacer-element-icon"
        alt="spacer"
        src={AI} 
      />
    </div>
  );
};

export default Sale;