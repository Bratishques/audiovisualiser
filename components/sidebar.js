import { useState } from "react";
import styled from "styled-components";
import ColorPicker from "../pages/colorPicker";

const H4 = styled.h4`
  margin-bottom: 8px;
  font-weight: 500;
  user-select: none;
`;


const Sidebar = ({ borderWidth, setBorderWidth, borderHeight, setBorderHeight, padding, setPadding, size, setSize, mode, setMode, mainCanvasColor, setMainCanvasColor, overlayCanvasColor, setOverlayCanvasColor}) => {

    const [isOpen, setIsOpen] = useState(true);
    const modes = ["BOTTOM_AXIS", "SYMMETRY"]

    const changeRadio = (e) => {
        setMode(e.target.value)
    }

  return (
    <div className="sidebar sidebar-container open">
      <div className="sidebar sidebar-sliders-wrap">
        <div>
          <H4>Width of the canvas</H4>
          <input
            type="range"
            min="300"
            max="1000"
            value={borderWidth}
            onChange={(e) => {
              console.log(Number(e.target.value));
              setBorderWidth(Number(e.target.value));
            }}
          />
        </div>

        <div>
          <H4>Height of the canvas</H4>
          <input
            type="range"
            min="100"
            max="250"
            value={borderHeight}
            onChange={(e) => {
              setBorderHeight(Number(e.target.value));
            }}
          ></input>
        </div>
        <div>
          <H4>Canvas padding</H4>
          <input
            type="range"
            min="10"
            max="100"
            value={padding}
            onChange={(e) => {
              setPadding(Number(e.target.value));
            }}
          ></input>
        </div>
        <div>
          <H4>Iteration size</H4>
          <input
            type="range"
            min="50"
            max="400"
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
            }}
          ></input>
        </div>
        <div>
          <H4>Main canvas mode</H4>
          <div className="radio-flex">
            <div>
              <label>
                <input
                  type="radio"
                  name="mode"
                  value="BOTTOM_AXIS"
                  checked={mode === "BOTTOM_AXIS"}
                  onChange={changeRadio}
                />
                Bottom axis
              </label>
            </div>
            <div>
              <label>
                <input
                  type="radio"
                  name="mode"
                  value="SYMMETRY"
                  checked={mode === "SYMMETRY"}
                  onChange={changeRadio}
                />
                Symmetry
              </label>
            </div>
            <div>
              <H4
                onClick={(e) => {
                  e.preventDefault;
                }}
              >
                Main canvas color
              </H4>
              <ColorPicker
                passedColor={mainCanvasColor}
                setPassedColor={setMainCanvasColor}
                id="main-canvas"
              />
            </div>
            <div>
              <H4>Overlay canvas color</H4>
              <ColorPicker
                passedColor={overlayCanvasColor}
                setPassedColor={setOverlayCanvasColor}
                id="overlay-canvas"
              />
            </div> 
          </div>
        </div>
      </div>
      <div className="sidebar sidebar-mode-radio"></div>
    </div>
  );
};

export default Sidebar;
