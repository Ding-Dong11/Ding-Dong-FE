import './App.css';
import './sale.css'; // 1. sale.css 파일 연결 확인!
import BottomBar from './components/BottomBar'; 
import Sale from './sale'; // 2. Sale 컴포넌트 import

function App() {
  return (
    <div className='body' style={{ display: 'flex', justifyContent: 'center' }}> 
      <div className='app-container' style={{ width: '24.563rem', minHeight: '100vh', paddingBottom: '80px', position: 'relative', backgroundColor: '#fafafa' }}>
        
        {/* main의 padding을 0으로 만들어 sale 내부 레이아웃이 깨지지 않게 합니다 */}
        <main style={{ padding: '0', textAlign: 'center' }}>
          {/* 3. 화면에 Sale 컴포넌트 배치 */}
          <Sale />
        </main>

        <BottomBar />
      </div> 
    </div> 
  );
}

export default App;