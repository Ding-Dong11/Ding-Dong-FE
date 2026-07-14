import './App.css';
import BottomBar from './components/BottomBar'; 

function App() {
  return (
    <div className='body' style={{ display: 'flex', justifyContent: 'center' }}> 
      {/* 바텀 바 너비(24.563rem)와 통일해주면 PC에서도 예쁘게 모바일 크기로 보입니다 */}
      <div className='app-container' style={{ width: '24.563rem', minHeight: '100vh', paddingBottom: '80px', position: 'relative', backgroundColor: '#fafafa' }}>
        
        <main style={{ padding: '20px', textAlign: 'center' }}>
        </main>

        {/* 바텀 바 컴포넌트 배치 */}
        <BottomBar />

      </div> 
    </div> 
  );
}

export default App;