import { FC } from 'react';
import SourceImage from './source.svg';
import DestImage from './dest.svg';
import './grid.css'
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions, ActionTypes } from './algorithms/walls';
import { gridCellSideLength } from './algorithms/helper';

interface Props {
  gridWidth: number,
  grid: boolean[],
  disabled: boolean,
}

const Grid: FC<Props> = ({ grid, gridWidth, disabled }) => {
  let dispatch = useDispatch<Dispatch<Actions>>();
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${gridWidth},${gridCellSideLength}px)`,
        gridAutoRows: `${gridCellSideLength}px`
      }}
      onDragStart={(e) => {
        if (disabled) return;
        let target = e.target as HTMLDivElement;
        let id = parseInt(target.id);
        if (isNaN(id) === false) {
          grid[id] = true;
          if (grid[id] === false) grid[id] = true;
          dispatch({ type: ActionTypes.MAKE_WALL, payload: { index: id } })
          // target.style.backgroundColor = "black";
          target.classList.add("wall-animate");
        }
      }}
      onDragEnter={(e) => {
        if (disabled) return;
        let target = e.target as HTMLDivElement;
        let id = parseInt(target.id);
        if (isNaN(id) === false) {
          grid[id] = true;
          if (grid[id] === false) grid[id] = true;
          dispatch({ type: ActionTypes.MAKE_WALL, payload: { index: id } })
          // target.style.backgroundColor = "black";
          target.classList.add("wall-animate");
        }
      }}
      onTouchMove={(e) => {
        if (disabled) return;
        let target = e.target as HTMLDivElement;
        let id = parseInt(target.id);
        if (isNaN(id) === false) {
          grid[id] = true;
          if (grid[id] === false) grid[id] = true;
          dispatch({ type: ActionTypes.MAKE_WALL, payload: { index: id } })
          // target.style.backgroundColor = "black";
          target.classList.add("wall-animate");
        }
      }}
    >
      {
        grid.map((visited, i) => (
          <div
            key={i}
            id={`${i}`}
            className="cell"
            style={visited ? {
              backgroundColor: 'black',
              width: `${gridCellSideLength - 2}px`,
              height: `${gridCellSideLength - 2}px`,
              lineHeight: `${gridCellSideLength - 2}px`,
            } : {
              backgroundColor: "rgb(0, 255, 170)",
              width: `${gridCellSideLength - 2}px`,
              height: `${gridCellSideLength - 2}px`,
              lineHeight: `${gridCellSideLength - 2}px`,
            }}
            draggable
          >
            <img className="source" id={`source${i}`} src={SourceImage} alt="S" />
            <img className="dest" id={`dest${i}`} src={DestImage} alt="D" />
          </div>
        ))
      }
    </div>
  )
}
export default Grid;