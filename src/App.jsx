import CustomEditor from "./components/CustomEditor";

function App() {
  return (
    <div className=" app_container">
      {/* heading and button */}
      <div className="bg_light_slate">
        <div className="heading_and_button_container">
          <h1 className="heading ">Demo Editor by Vivek Khanal</h1>
          <div className="btn_container">
            <button className="save_btn">Save</button>
          </div>
        </div>
      </div>
      {/* editor */}
      <div className="editor_container">
        <CustomEditor />
      </div>
    </div>
  );
}

export default App;
