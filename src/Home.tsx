import SourceImage from './source.svg';
import DestImage from './dest.svg';
import './home.css';
import { useLayoutEffect, useState } from 'react';

export default function Home() {
  let [showDemo, toggleShowDemo] = useState(false);
  useLayoutEffect(() => {
    if (showDemo) window.scroll({ top: document.body.scrollHeight, behavior: "smooth" });
  })
  return (
    <div className="home">
      <div className="instructions">
        <h3>
          1) Click and Drag Grid cells (<i>swipe if on touch screen device</i>)
          to mark them as wall.{" "}
          <svg
            width="21"
            height="21"
            viewBox="0 0 21 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="21" height="21" rx="4" fill="black" />
          </svg>
        </h3>
        <h3>
          2) Click on any non-wall cell to mark it as Source.{" "}
          <img src={SourceImage} alt="Source"></img>
        </h3>
        <h3>
          3) Click on any Grid cell to to mark it as Destination.{" "}
          <img src={DestImage} alt="Destination"></img>
        </h3>
        <h3>4) Click on Animate Path button to start Pathfinding.</h3>
        <h3>5) Grid represents an Undirected Unweighted Graph.</h3>
      </div>
      <button
        className="demobtn"
        onClick={
          () => {
            toggleShowDemo(!showDemo)
          }
        }
      >
        {showDemo ? 'Hide Demo' : 'Show Demo'}
      </button>
      <div id="titlecontainer">
        <h1 id="title">Pathfinder</h1>
      </div>
      {showDemo &&
        <fieldset style={{ margin: "5px", borderRadius: "10px" }}>
          <legend
            style={{ cursor: 'pointer' }}
            onClick={
              () => {
                toggleShowDemo(!showDemo)
              }}
          >
            Demo
          </legend>
          {
            navigator.maxTouchPoints > 0 ?
              <video src={process.env.PUBLIC_URL + '/mobile.mp4'} autoPlay loop controls style={{ width: "100%", }}></video>
              :
              <video src={process.env.PUBLIC_URL + '/desktop.mp4'} autoPlay loop controls style={{ width: "100%", }}></video>
          }
        </fieldset>
      }
    </div>
  )
}
