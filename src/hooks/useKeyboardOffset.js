import { useEffect, useState } from 'react';

const KEYBOARD_OFFSET_LIMIT = 420;
const KEYBOARD_SAFE_GAP = 40;

function getKeyboardOffset() {
  if (!window.visualViewport) return 0;

  const offset = window.innerHeight - window.visualViewport.height - window.visualViewport.offsetTop;
  const keyboardOffset = offset > 0 ? offset + KEYBOARD_SAFE_GAP : 0;

  return Math.min(Math.max(keyboardOffset, 0), KEYBOARD_OFFSET_LIMIT);
}

function useKeyboardOffset() {
  const [keyboardOffset, setKeyboardOffset] = useState(0);

  useEffect(() => {
    if (!window.visualViewport) return undefined;

    const updateKeyboardOffset = () => {
      setKeyboardOffset(getKeyboardOffset());
    };

    window.visualViewport.addEventListener('resize', updateKeyboardOffset);
    window.visualViewport.addEventListener('scroll', updateKeyboardOffset);
    updateKeyboardOffset();

    return () => {
      window.visualViewport.removeEventListener('resize', updateKeyboardOffset);
      window.visualViewport.removeEventListener('scroll', updateKeyboardOffset);
    };
  }, []);

  return keyboardOffset;
}

export default useKeyboardOffset;
