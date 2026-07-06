import React, { useState, useEffect } from 'react';

const DecryptedText = ({ text = "Hello World", speed = 50, idleDelay = 2000 }) => {
  const [displayText, setDisplayText] = useState(text);

  const chars = '!@#$%^&*_+-=[]{}|;:,.<>?';

  useEffect(() => {
    let currentIndex = 0;
    let timeoutId = null;
    let intervalId = null;

    const startHashLeft = () => {
      let decryptIndex = text.length;
      intervalId = setInterval(() => {
        if (decryptIndex > 0) {
          const hashText = text
            .split('')
            .map((char, index) => {
              if (index >= decryptIndex) {
                return chars[Math.floor(Math.random() * chars.length)];
              }
              return char;
            })
            .join('');

          setDisplayText(hashText);
          decryptIndex--;
        } else {
          clearInterval(intervalId);
          setDisplayText('');
          startHashRight();
        }
      }, speed);
    };

    const startHashRight = () => {
      let hashIndex = 0;
      intervalId = setInterval(() => {
        if (hashIndex <= text.length) {
          const hashText = Array(hashIndex)
            .fill(0)
            .map(() => chars[Math.floor(Math.random() * chars.length)])
            .join('');

          setDisplayText(hashText);
          hashIndex++;
        } else {
          clearInterval(intervalId);
          startDecrypt();
        }
      }, speed);
    };

    const startDecrypt = () => {
      currentIndex = 0;
      intervalId = setInterval(() => {
        if (currentIndex <= text.length) {
          const decrypted = text
            .split('')
            .map((char, index) => {
              if (index < currentIndex) {
                return char;
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');

          setDisplayText(decrypted);
          currentIndex++;
        } else {
          clearInterval(intervalId);
          
          setDisplayText(text);
          timeoutId = setTimeout(() => {
            startHashLeft();
          }, idleDelay);
        }
      }, speed);
    };

    startDecrypt();

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [text, speed, idleDelay, chars]);

  return (
    <span className="font-folklore text-5xl font-bold tracking-wider">
      {displayText}
    </span>
  );
};

export default DecryptedText;