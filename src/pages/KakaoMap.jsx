import { useEffect, useRef, useState } from 'react';
import '../styles/kakao-map.css';

const KAKAO_MAP_APP_KEY = 'abae8f4bdfea8129776191d2ebe3242b';
const KAKAO_MAP_SDK_ID = 'kakao-map-sdk';
const KAKAO_MAP_SDK_URL = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APP_KEY}&autoload=false&libraries=clusterer`;
const DEFAULT_CENTER = {
  lat: 37.566826,
  lng: 126.9786567,
};
const MY_LOCATION_RADIUS = 500;
const MAP_RESIZE_DEBOUNCE_MS = 150;
const TEST_MARKER_OFFSETS = [
  [0.0012, 0.0006],
  [0.0018, -0.0004],
  [0.0008, -0.0011],
  [-0.0007, 0.0013],
  [-0.0014, 0.0005],
  [-0.0018, -0.0008],
  [0.0024, 0.0018],
  [0.0028, -0.0016],
  [-0.0022, 0.0019],
  [-0.0026, -0.0014],
  [0.0036, 0.0009],
  [-0.0034, -0.0006],
];

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('위치 기능을 지원하지 않습니다.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  });
}

function loadKakaoMapSdk() {
  return new Promise((resolve, reject) => {
    if (window.kakao?.maps) {
      window.kakao.maps.load(resolve);
      return;
    }

    const existingScript = document.getElementById(KAKAO_MAP_SDK_ID);

    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = KAKAO_MAP_SDK_ID;
    script.src = KAKAO_MAP_SDK_URL;
    script.async = true;
    script.onload = () => {
      if (!window.kakao?.maps) {
        reject(new Error('SDK_LOADED_BUT_KAKAO_IS_MISSING'));
        return;
      }

      window.kakao.maps.load(resolve);
    };
    script.onerror = () => reject(new Error('SDK_SCRIPT_LOAD_FAILED'));
    document.head.appendChild(script);
  });
}

function KakaoMap() {
  const mapRef = useRef(null);
  const recenterLocationRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [locationStatus, setLocationStatus] = useState('현재 위치를 확인하는 중입니다.');

  useEffect(() => {
    let isMounted = true;
    let map = null;
    let marker = null;
    let circle = null;
    let markerClusterer = null;
    let testMarkers = [];
    let resizeTimer = null;
    let watchId = null;
    let handleResize = null;

    loadKakaoMapSdk()
      .then(async () => {
        if (!mapRef.current) {
          throw new Error('MAP_CONTAINER_IS_MISSING');
        }

        let initialPosition = null;

        try {
          initialPosition = await getCurrentPosition();
        } catch (error) {
          if (isMounted) {
            setLocationStatus(`현재 위치를 가져오지 못했습니다: ${error.message}`);
          }
        }

        const initialCoords = initialPosition?.coords;
        const center = new window.kakao.maps.LatLng(
          initialCoords?.latitude ?? DEFAULT_CENTER.lat,
          initialCoords?.longitude ?? DEFAULT_CENTER.lng,
        );

        map = new window.kakao.maps.Map(mapRef.current, {
          center,
          level: initialCoords ? 4 : 3,
          tileAnimation: false,
        });

        testMarkers = TEST_MARKER_OFFSETS.map(([latOffset, lngOffset]) => (
          new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(
              center.getLat() + latOffset,
              center.getLng() + lngOffset,
            ),
          })
        ));

        markerClusterer = new window.kakao.maps.MarkerClusterer({
          map,
          averageCenter: true,
          minLevel: 4,
          markers: testMarkers,
        });

        const relayoutMap = () => {
          if (!map) return;

          const currentCenter = map.getCenter();

          map.relayout();
          map.setCenter(currentCenter);
        };

        const updateMyLocation = ({ latitude, longitude, accuracy }, shouldCenterMap = false) => {
          if (!map) return;

          const myCenter = new window.kakao.maps.LatLng(latitude, longitude);
          recenterLocationRef.current = () => {
            if (!map) return;

            map.relayout();
            map.setCenter(myCenter);
          };

          if (!marker) {
            marker = new window.kakao.maps.Marker({
              map,
              position: myCenter,
            });
          } else {
            marker.setPosition(myCenter);
            marker.setMap(map);
          }

          if (!circle) {
            circle = new window.kakao.maps.Circle({
              map,
              center: myCenter,
              radius: MY_LOCATION_RADIUS,
              strokeWeight: 2,
              strokeColor: '#f59e0b',
              strokeOpacity: 0.9,
              fillColor: '#f59e0b',
              fillOpacity: 0.15,
            });
          } else {
            circle.setPosition(myCenter);
            circle.setMap(map);
          }

          map.relayout();

          if (shouldCenterMap) {
            map.setCenter(myCenter);
          }

          setLocationStatus(
            `현재 위치: ${latitude.toFixed(6)}, ${longitude.toFixed(6)} / 정확도 약 ${Math.round(accuracy)}m`,
          );
        };

        if (initialCoords) {
          updateMyLocation(initialCoords, true);
        }

        handleResize = () => {
          if (resizeTimer) window.clearTimeout(resizeTimer);
          resizeTimer = window.setTimeout(relayoutMap, MAP_RESIZE_DEBOUNCE_MS);
        };
        window.addEventListener('resize', handleResize);

        if (!navigator.geolocation) {
          setLocationStatus('현재 위치를 가져오지 못했습니다: 위치 기능을 지원하지 않습니다.');
          return;
        }

        watchId = navigator.geolocation.watchPosition(
          (position) => {
            if (!isMounted || !map) return;

            updateMyLocation(position.coords);
          },
          (error) => {
            if (!isMounted) return;

            setLocationStatus(`현재 위치를 가져오지 못했습니다: ${error.message}`);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          },
        );
      })
      .catch((error) => {
        setErrorMessage(`카카오맵 로딩 실패: ${error.message}\n현재 주소: ${window.location.origin}\nSDK 주소: ${KAKAO_MAP_SDK_URL}`);
      });

    return () => {
      isMounted = false;
      if (resizeTimer) window.clearTimeout(resizeTimer);
      if (watchId) navigator.geolocation.clearWatch(watchId);
      if (handleResize) window.removeEventListener('resize', handleResize);
      if (marker) marker.setMap(null);
      if (circle) circle.setMap(null);
      if (markerClusterer) markerClusterer.clear();
      testMarkers.forEach((testMarker) => testMarker.setMap(null));
      map = null;
    };
  }, []);

  return (
    <main className="map-page">
      <div className="map-screen">
        <div className="map-container" ref={mapRef} />

        <div className="map-top-bar">
          <label className="map-search">
            <span className="map-search-icon" aria-hidden="true" />
            <input type="search" placeholder="검색어를 입력해주세요" autoComplete="off" />
          </label>
          <button type="button" className="map-help-button" aria-label="도움말">
            ?
          </button>
        </div>

        <p className="map-status">{locationStatus}</p>
        {errorMessage && <pre className="map-error">{errorMessage}</pre>}

        <button
          type="button"
          className="map-current-button"
          aria-label="현재 위치로 이동"
          onClick={() => recenterLocationRef.current?.()}
        >
          <span aria-hidden="true" />
        </button>

        <div className="map-bottom-panel">
          <button type="button" className="map-visit-button">
            방문 확인
          </button>
          <nav className="map-tab-bar" aria-label="하단 메뉴">
            <button type="button" className="map-tab map-tab-active">
              <span className="map-tab-icon map-tab-map" aria-hidden="true" />
              지도
            </button>
            <button type="button" className="map-tab">
              <span className="map-tab-icon map-tab-star" aria-hidden="true" />
              추천
            </button>
            <button type="button" className="map-tab">
              <span className="map-tab-icon map-tab-badge" aria-hidden="true" />
              할인
            </button>
            <button type="button" className="map-tab">
              <span className="map-tab-icon map-tab-ticket" aria-hidden="true" />
              쿠폰
            </button>
            <button type="button" className="map-tab">
              <span className="map-tab-icon map-tab-user" aria-hidden="true" />
              마이
            </button>
          </nav>
        </div>
      </div>
    </main>
  );
}

export default KakaoMap;
