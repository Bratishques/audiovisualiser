import { useCallback, useEffect, useState } from "react";
import HuePicker from "./huePicker";

const ColorPicker = ({ passedColor, setPassedColor, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coordinates, setCoordinates] = useState({ x: 120, y: 0 });
  const [isPressed, setIsPressed] = useState(false);
  const [mainHue, setMainHue] = useState(`rgb(255,0,0)`);

  const getColorFromHueAndCoordinates = (x, y, hue, width, height) => {
    const match = hue.match(/([0-9]+\.*[0-9]*)/g);
    if (match) {
      const r = match[0];
      const g = match[1];
      const b = match[2];
      console.log(r,g,b)
      const fixedR =
        Number(r) +
        (255 - r) * (1 - x / width) * (1 - y / height) -
        ((255 - (255 - r)) * y) / height;
      const fixedG =
        Number(g) +
        (255 - g) * (1 - x / width) * (1 - y / height) -
        ((255 - (255 - g)) * y) / height;
      const fixedB =
        Number(b) +
        (255 - b) * (1 - x / width) * (1 - y / height) -
        ((255 - (255 - b)) * y) / height;
      if (fixedR) {
        console.log(fixedR)
        setPassedColor(`rgb(${fixedR}, ${fixedG}, ${fixedB})`);
      }

      
    }
  };

  const elementId = id + "-picker";

  const setCoords = (x, y) => {
    setCoordinates({
      x: x,
      y: y,
    });
  };

  useEffect(() => {

    if (mainHue) {
 
    const colorPicker = document.getElementById(elementId);
    const width = colorPicker.getBoundingClientRect().width;
    const height = colorPicker.getBoundingClientRect().height;
    getColorFromHueAndCoordinates(
      coordinates.x,
      coordinates.y,
      mainHue,
      width,
      height
    );
  }
  }, [coordinates, mainHue]);

  //Listener for the point movement

  const listener = useCallback((e) => {
    const colorPicker = document.getElementById(elementId);
    const x = colorPicker.getBoundingClientRect().x;
    const y = colorPicker.getBoundingClientRect().y;
    const width = colorPicker.getBoundingClientRect().width;
    const height = colorPicker.getBoundingClientRect().height;
    let accurateX = e.clientX - x;
    let accurateY = e.clientY - y;
    if (accurateX < 0) {
      accurateX = 0;
    } else if (accurateX > width) {
      accurateX = width;
    }

    if (accurateY < 0) {
      accurateY = 0;
    } else if (accurateY > height) {
      accurateY = height;
    }

    setCoords(accurateX, accurateY);
  });

  const cleanListener = useCallback((e) => {
    setIsPressed(false);
    window.removeEventListener("mousemove", listener);
  });

  useEffect(() => {
    if (isPressed) {
      window.addEventListener("mousemove", listener);
      window.addEventListener("mouseup", cleanListener);

      return () => {
        window.removeEventListener("mousemove", listener);
        window.removeEventListener("mouseup", cleanListener);
      };
    }
  }, [isPressed]);

  return (
    <div className="cp cp-container">
      <div
        className="cp cp-dropdown-control"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div
          style={{
            backgroundColor: passedColor,
            width: "30px",
            border: "1px solid black",
            height: "30px",
          }}
        ></div>
      </div>
      <div
        className="cp cp-dropdown-container"
        style={{
          height: isOpen ? "150px" : "0px",
          padding: isOpen ? "10px" : "0px",
        }}
      >
        <div
          className="cp cp-dropdown-wrap"
          style={{
            position: "absolute",
            zIndex: 200,
            width: "100%",
            height: "100%",
          }}
          id={elementId}
          onMouseDown={(e) => {
            setIsPressed(true);
            console.log(e.clientX, e.clientY);
            const colorPicker = document.getElementById(elementId);
            let valueX = e.clientX - colorPicker.getBoundingClientRect().x;
            let valueY = e.clientY - colorPicker.getBoundingClientRect().y;
            setCoords(valueX, valueY);
            console.log(valueX, valueY);
          }}
        >
          <div
            className="cp cp-dropdown-color"
            style={{
              backgroundColor: mainHue,
            }}
          >
            <div className="cp cp-dropdown-saturation">
              <div className="cp cp-dropdown-bw">
                <div
                  className="cp cp-dropdown-draggable"
                  style={{
                    display: !isOpen && "none",
                    top: coordinates.y - 2.5,
                    left: coordinates.x - 2.5,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <HuePicker isOpen={isOpen} elementId={elementId} setHue={setMainHue} />
      </div>
    </div>
  );
};

export default ColorPicker;
