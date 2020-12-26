import { useCallback, useEffect, useState } from "react"

const HuePicker = ({isOpen, elementId, setHue }) => {
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [sliderY, setSliderY] = useState(0)

  const getSliderPosition = () => {
    
  }

  const getColorFromPosition = (sliderValue) => {
    const huePicker = document.getElementById(id)
    const proportion = huePicker.getBoundingClientRect().height/6
    const position = Number(sliderValue)
    console.log(position)
    if (position === 0) {

      setHue(`rgb(${255},0,0)`)
    }
    else if (position < proportion) {

      setHue(`rgb(${255},${255/(proportion/position)},0)`)
    }
    else if (position >= proportion && position < proportion * 2) {
 
      setHue(`rgb(${255 - 255/(proportion/(position - proportion))},255,0)`)
    }
    else if (position >= proportion * 2 && position < proportion * 3) {
 
      setHue(`rgb(0, 255, ${255/(proportion/(position - (proportion * 2)))})`)
    }
    else if (position >= proportion * 3 && position < proportion * 4) {
 
      setHue(`rgb(0, ${255 - 255/(proportion/(position - (proportion * 3)))}, 255)`)
    }
    else if (position >= proportion * 4 && position < proportion * 5) {

      setHue(`rgb(${255/(proportion/(position - (proportion * 4)))}, 0, 255)`)
    }
    else if (position >= proportion * 4 && position < proportion * 5) {

      setHue(`rgb(${255/(proportion/(position - (proportion * 4)))}, 0, 255)`)
    }
    else if (position >= proportion * 5) {

      setHue(`rgb(255, 0, ${255 - 255/(proportion/(position - (proportion * 5)))})`)
    }
    else {
      setHue(`rgb(255,0,0)`)
    }
  }

  const listener = useCallback((e) => {
    const huePicker = document.getElementById(id)
    let valueY = e.pageY - huePicker.getBoundingClientRect().y;
    const height = huePicker.getBoundingClientRect().height
    if (valueY < 0) {
      valueY = 0;
    }
    if (valueY > height) {
      valueY = height
    }
    setSliderY(valueY)
  })

  const clearListener = useCallback((e) => {
    setIsMouseDown(false)
    window.removeEventListener("mousemove", listener)
  })

  useEffect(() => {
    if (isMouseDown) {
    getColorFromPosition(sliderY)
  }
  }, [sliderY])

  useEffect(() => {

  }, [])
 

  useEffect(() => {
    if (isMouseDown) {
      window.addEventListener("mousemove", listener)
      window.addEventListener("mouseup", clearListener)
      return () => {
        window.removeEventListener("mousemove", listener)
        window.removeEventListener("mouseup", clearListener)
      }
    }
  }, [isMouseDown])

  const id = elementId + "-hue-picker"
    return (
        <div 
        className="cp cp-dropdown-hue" 
        id = {id}
        style={{
          display: !isOpen && "none"
        }}
        onMouseDown= {(e) => {
          const huePicker = document.getElementById(id)
          let valueY = e.pageY - huePicker.getBoundingClientRect().y;

          setIsMouseDown(true)
          setSliderY(valueY)
        }}
        >
        
        <div className="cp cp-dropdown-hue-draggable"
        style = {{
          top: sliderY - 2
        }
        }
        ></div>
      </div>
    )
}

export default HuePicker