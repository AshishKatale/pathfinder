import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { HashRouter as Router, Switch, NavLink, Route } from 'react-router-dom';
import './App.css';
import Home from './Home';
import BFS from './algorithms/BFS';
import DFS from './algorithms/DFS';
import GBFS from './algorithms/GBFS';
import Dijkstra from './algorithms/Dijkstra';
import { Actions, ActionTypes } from './algorithms/walls';
import { Dispatch } from 'redux';
import BidirectionalSearch from './algorithms/Bidirectional';

function App() {

  let dispatch = useDispatch<Dispatch<Actions>>();
  let gridWidth = Math.floor(window.innerWidth / 30);
  let gridHeight = Math.floor((window.innerHeight * 0.7) / 30);
  dispatch({ type: ActionTypes.RESIZE_GRID, payload: { size: gridWidth * gridHeight } });

  useEffect(() => {
    let id: NodeJS.Timeout;
    let reload = () => window.location.reload();
    if (window.navigator.maxTouchPoints > 0) {
      window.addEventListener("orientationchange", () => {
        clearTimeout(id);
        id = setTimeout(reload, 100);
      });
      return () => window.removeEventListener("orientationchange", reload);
    } else {
      window.addEventListener("resize", () => {
        clearTimeout(id);
        id = setTimeout(reload, 100);
      });
      return () => window.removeEventListener("resize", reload);
    }
  }, [dispatch]);

  return (
    <div className="container">
      <Router>
        <nav id="nav" className="nav">
          <NavLink exact to="/"
            activeClassName="activeNavlink"
            className="navlink"
            title={"Home"}
          >
            HOME
          </NavLink>
          <NavLink
            to="/bfs"
            activeClassName="activeNavlink"
            className="navlink"
            title={"Breadth First Search"}
          >
            BFS
          </NavLink>
          <NavLink
            to="/dfs"
            activeClassName="activeNavlink"
            className="navlink"
            title={"Depth First Search"}
          >
            DFS
          </NavLink>
          <NavLink
            to="/dijkstra"
            activeClassName="activeNavlink"
            className="navlink"
            title={"Dijkstra's Algrorithm"}
          >
            Dijkstra
          </NavLink>
          <NavLink
            to="/gbfs"
            activeClassName="activeNavlink"
            className="navlink"
            title={"Greedy Best First Search"}
          >
            GBFS
          </NavLink>
          <NavLink
            to="/bidirectional"
            activeClassName="activeNavlink"
            className="navlink"
            title={"Bidirectional Search"}
          >
            Bidirectional
          </NavLink>
        </nav>
        <Switch>
          <Route exact path="/" component={Home}></Route>
          <Route path="/bfs" component={BFS}></Route>
          <Route path="/dfs" component={DFS}></Route>
          <Route path="/dijkstra" component={Dijkstra}></Route>
          <Route path="/gbfs" component={GBFS}></Route>
          <Route path="/bidirectional" component={BidirectionalSearch}></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
