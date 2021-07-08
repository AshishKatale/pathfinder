import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Grid from '../Grid';
import TopBar from '../TopBar';
import { wait, directions, clearGrid, isValidCell, clearWalls, gridCellSideLength } from './helper';

let halt = false;
let speed = 75;

async function visit(cellId: number) {
	await wait(speed);
	if (halt) return;
	let cell = document.getElementById(`${cellId}`);
	if (cell === null || cell === undefined) return;
	cell.classList.add("visit-animate")
}

async function bfs(
	grid: boolean[],
	parent: number[],
	gridWidth: number,
	gridHeight: number,
	source: number,
	dest: number
) {

	let neighbours = 4;
	if (grid[dest] === false) {
		let visitQueue: number[] = [];
		visitQueue.push(source);
		await visit(source);
		grid[source] = true;
		while (visitQueue.length > 0) {
			if (halt) return false;
			let next = visitQueue.shift()!;
			let i = Math.floor(next / gridWidth);
			let j = next % gridWidth;
			for (let c = 0; c < neighbours; c++) {
				let dir = directions[c];
				let x = i + dir.x;
				let y = j + dir.y;
				let validCell = await isValidCell(x, y, gridWidth, gridHeight);
				if (validCell) {
					next = x * gridWidth + y;
					if (grid[next] === false) {
						visitQueue.push(next);
						parent[next] = i * gridWidth + j;
						await visit(next);
						grid[next] = true;
						if (next === dest) return true;
					}
				}
			}
		}
		return false;
	}
	return false;
}

async function drawPath(parent: number[], source: number, dest: number) {
	let i = dest;
	while (true) {
		if (halt) return;
		let div = document.getElementById(`${i}`);
		if (div === null || div === undefined) return;
		div.classList.add("path-animate");
		if (i === source) break;
		i = parent[i];
		await wait(5);
	}
}

const BFS = () => {
	let walls = useSelector<boolean[], boolean[]>(walls => walls);
	let parent: number[] = [];
	let gridWidth = Math.floor(window.innerWidth / gridCellSideLength);
	let gridHeight = Math.floor((window.innerHeight * 0.7) / gridCellSideLength);

	let sourceId = useRef<number>(Infinity);
	let destId = useRef<number>(Infinity);
	let isReachable = useRef(false);
	let ranAlready = useRef(false);
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
		// console.log("uef", walls)
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
		setRunning(true);
		ranAlready.current = true;
		isReachable.current = await bfs(grid,
			parent,
			gridWidth,
			gridHeight,
			sourceId.current,
			destId.current
		);
		if (isReachable.current) await drawPath(parent,
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
						if (sourceId.current === destId.current) {
							alert("Source and Destination should be distinct");
							return;
						}
						let dest = document.getElementById(`dest${destId.current}`) as HTMLDivElement;
						dest.style.visibility = "visible";
						isDestSelected.current = true;
					}
				}
				else if (ranAlready.current) {
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

export default BFS;