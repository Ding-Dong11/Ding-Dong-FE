import { useState } from "react";
import "./BottomBar.css";

const BottomBar = ({ className = "", variant = "기본" }) => {
  // 현재 어떤 탭이 선택되었는지 기억하는 상태 (기본값 0: 지도)
  const [activeTab, setActiveTab] = useState(0);

  // 탭 데이터 리스트
  const tabs = [
    { id: 0, label: "지도", src: "/src/assets/icon-maps-map.svg" },
    { id: 1, label: "추천", src: "/src/assets/mdi_sale-outline.svg" },
    { id: 2, label: "할인", src: "/src/assets/line-md_star.svg" },
    { id: 3, label: "쿠폰", src: "/src/assets/tabler_ticket.svg" },
    { id: 4, label: "마이", src: "/src/assets/person.svg" },
  ];

  return (
    <div className={`bottom-bar ${className}`} data-1={variant}>
      <div className="navigation-bar">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            // 선택된 탭이면 'active' 클래스를 추가로 붙여줍니다
            className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <img className="nav-icon" alt={tab.label} src={tab.src} />
            <div className="nav-text">{tab.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomBar;