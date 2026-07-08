import React, { useState, useEffect } from "react";

function TextType({ 
  strings = [], 
  typeSpeed = 80, 
  backSpeed = 40, 
  backDelay = 1500, 
  startDelay = 500 
}) {
  const [currentStringIndex, setCurrentStringIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (strings.length === 0) return;

    const fullText = strings[currentStringIndex];
    
    let speed = isDeleting ? backSpeed : typeSpeed;

    if (!isDeleting && currentText === fullText) {
      const timeout = setTimeout(() => setIsDeleting(true), backDelay);
      return () => clearTimeout(timeout);
    } 
    
    if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setCurrentStringIndex((prevIndex) => (prevIndex + 1) % strings.length);
      const timeout = setTimeout(() => {}, startDelay);
      return () => clearTimeout(timeout);
    }

    const handleTyping = setTimeout(() => {
      setCurrentText((prev) =>
        isDeleting
          ? fullText.substring(0, prev.length - 1)
          : fullText.substring(0, prev.length + 1)
      );
    }, speed);

    return () => clearTimeout(handleTyping);
  }, [currentText, isDeleting, currentStringIndex, strings, typeSpeed, backSpeed, backDelay, startDelay]);

  return (
    <span>
      {currentText}
      <span className="animate-[pulse_0.8s_infinite] ml-0.5 font-normal select-none">|</span>
    </span>
  );
}

export default TextType;