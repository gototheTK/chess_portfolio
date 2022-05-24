import "./App.css";
import MainContainer from "./front-end/MainContainer";
import { Provider } from "react-redux";
import { createStore } from "redux";
const rootReducer = (state = [], action) => {
  switch (action.type) {
    case "add":
      return [...state, action.message];
    default:
      return state;
  }
};
const store = createStore(rootReducer);
function App() {
  return (
    <Provider store={store}>
      <MainContainer />
    </Provider>
  );
}

export default App;
