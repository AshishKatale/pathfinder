import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import TopBar from '../TopBar';
import Grid from '../Grid';
import { wait, directions, clearGrid, isValidCell, clearWalls, gridCellSideLength } from './helper';

let halt = false;
let speed = 75;

function manhattanDistance(x: number, y: number, gridWidth: number) {
  return (
    Math.abs(Math.floor(y / gridWidth) - Math.floor(x / gridWidth)) +
    Math.abs((y % gridWidth) - (x % gridWidth))
  );
}

async function visit(cellId: number) {
  if (halt) return;
  let cell = document.getElementById(`${cellId}`);
  if (cell === null || cell === undefined) return;
  cell.classList.add("visit-animate");
  await wait(speed);
}


function extract(open: number[], mandist: number[]) {
  let min = Infinity,
    ext: number = 0;
  for (let c = 0; c < open.length; c++) {
    let md = mandist[open[c]];
    if (min > md) {
      min = md;
      ext = c;
    }
  }
  let spl = open[ext];
  open.splice(ext, 1);
  return spl;
}


async function gbfs(
  grid: boolean[],
  closed: number[],
  parent: number[],
  gridWidth: number,
  gridHeight: number,
  source: number,
  dest: number
) {
  let neighbours = 4;
  let open = [];
  let mandist = [];
  open.push(source);
  mandist[source] = manhattanDistance(source, dest, gridWidth);
  grid[source] = true;
  while (open.length > 0) {
    if (halt) return false;
    let next = extract(open, mandist);
    closed.push(next);
    let i = Math.floor(next / gridWidth);
    let j = next % gridWidth;
    for (let c = 0; c < neighbours; c++) {
      let d = directions[c];
      let x = i + d.x;
      let y = j + d.y;
      let validCell = await isValidCell(x, y, gridWidth, gridHeight);
      if (validCell) {
        next = x * gridWidth + y;
        if (next === dest) {
          parent[next] = i * gridWidth + j;
          return true;
        };
        if (
          open.indexOf(next) === -1 &&
          closed.indexOf(next) === -1 &&
          grid[next] === false
        ) {
          open.push(next);
          mandist[next] = manhattanDistance(next, dest, gridWidth);
          parent[next] = i * gridWidth + j;
          await visit(next);
        }
      }
    }
  }
  return false;
}

async function drawPath(parent: number[], source: number, dest: number) {
  let i = dest;
  while (true) {
    if (halt) return;
    let div = document.getElementById(`${i}`);
    if (div !== null)
      div.classList.add("path-animate");
    if (i === source) break;
    i = parent[i];
    await wait(5);
  }
}

const GBFS = () => {
  let walls = useSelector<boolean[], boolean[]>(walls => walls);
  let parent: number[] = [];
  let closed: number[] = [];
  let gridWidth = Math.floor(window.innerWidth / gridCellSideLength);
  let gridHeight = Math.floor((window.innerHeight * 0.7) / gridCellSideLength);

  let sourceId = useRef<number>(Infinity);
  let destId = useRef<number>(Infinity);
  let ranAlready = useRef(false);
  let isReachable = useRef(false);
  let isDestSelected = useRef(false);
  let isSourceSelected = useRef(false);
  let scroller = useRef<HTMLDivElement | null>(null);

  let [mounted, setMounted] = useState(true);
  let [isRunning, setRunning] = useState(false);
  let [grid, setGrid] = useState<boolean[]>(() => {
    return [...walls]
  });

  useEffect(() => {
    setTimeout(() => {
      clearGrid(0, 0, [...walls])
    });
    return () => {
      setMounted(false)
      halt = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setGrid([...walls]);
  }, [walls])


  useEffect(() => {
    if (scroller.current !== null)
      scroller.current.scrollIntoView({ behavior: 'smooth' });
  })

  const animate = async () => {
    if (ranAlready.current) {
      alert("Reset Grid before animating again")
      return;
    }
    if (!isSourceSelected.current || !isDestSelected.current) {
      alert("Select Source and Denstination before animating")
      return;
    }
    halt = false;
    ranAlready.current = true;
    setRunning(true);
    isReachable.current = await gbfs(
      grid,
      closed,
      parent,
      gridWidth,
      gridHeight,
      sourceId.current,
      destId.current
    );
    if (isReachable.current)
      await drawPath(
        parent,
        sourceId.current,
        destId.current
      );
    else if (!halt) {
      let dest = document.getElementById(`${destId.current}`) as HTMLDivElement;
      dest.innerHTML = "";
      dest.style.background = "red";
    }
    if (mounted)
      setRunning(false);
  }

  return (
    <>
      <TopBar
        speed={speed}
        disabled={isRunning}
        clearWalls={() => clearWalls(walls)}
        clearGrid={() => {
          ranAlready.current = false;
          isReachable.current = false;
          isDestSelected.current = false;
          isSourceSelected.current = false;
          clearGrid(sourceId.current, destId.current, walls);
          setGrid([...walls]);
        }}
        start={animate}
        changeSpeed={(e) => {
          speed = 150 - parseInt((e.target as HTMLInputElement).value);
        }}
      />
      <div onClick={async (e) => {
        let target = e.target as HTMLDivElement;
        if (!isSourceSelected.current) {
          sourceId.current = parseInt(target.id);
          if (isNaN(sourceId.current) === false) {
            if (grid[sourceId.current] === true) {
              alert("Source cannot be a wall");
              return;
            }
            if (sourceId.current === destId.current) {
              alert("Source and Destination should be distinct");
              return;
            }
            isSourceSelected.current = true;
            let src = document.getElementById(`source${sourceId.current}`) as HTMLDivElement;
            src.style.visibility = "visible";
          }
        } else if (isSourceSelected.current && !isDestSelected.current) {
          destId.current = parseInt(target.id);
          if (isNaN(destId.current) === false) {
            if (grid[destId.current] === true) {
              alert("Destination cannot be a wall");
              return;
            }
            let dest = document.getElementById(`dest${destId.current}`) as HTMLDivElement;
            dest.style.visibility = "visible";
            isDestSelected.current = true;
          }
        } else if (ranAlready.current) {
          alert("Reset Grid before animating again")
        }
        else if (isSourceSelected.current && isDestSelected.current) {
          alert("Click Animate Path to start animation")
        }
      }}
      >
        <Grid grid={grid} gridWidth={gridWidth} disabled={isRunning} />
        <div ref={scroller} style={{ height: '2px' }}></div>
      </div>
    </>
  );
}

export default GBFS;