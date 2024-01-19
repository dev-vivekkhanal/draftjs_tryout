import CustomEditor2 from "./CustomEditor";
import HeadingEditor from "./HeadingEditor";
import HeadingEditorTwo from "./HeadingEditorTwo";
import MyEditor from "./MyEditor";
import CustomEditor from "./components/CustomEditor";

function App() {
  return (
    <div className=" flex flex-col min-h-screen w-full pb-10">
      {/* heading and button */}
      <div className="bg-slate-100">
        <div className="grid grid-cols-3  items-center  w-[80%] mx-auto  p-5">
          <h1 className="col-start-2 text-center font-semibold text-xl ">
            Demo editor by Vivek Khanal
          </h1>
          <div className="col-start-3">
            <button className="block ml-auto bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all p-2 px-8 rounded-md font-semibold text-white">
              Save
            </button>
          </div>
        </div>
      </div>
      {/* editor */}
      <div className="flex-1 border h-full  flex flex-col w-[80%] mx-auto">
        {/* <Editor editorState={editorState} onChange={setEditorState} /> */}
        {/* <HeadingEditor /> */}
        {/* <HeadingEditorTwo /> */}
        <CustomEditor />
        {/* <MyEditor /> */}
      </div>
    </div>
  );
}

export default App;
