

const Inputs = ({setAudioLink, audioLink}) => {

    return (
      <div>
        <div>
          <label htmlFor="link">
            Please enter an audio link:
            <input
              type="link"
              id="link"
              value={audioLink}
              onChange={(e) => {
                setAudioLink(e.target.value);
              }}
            ></input>
          </label>
          <button
            onChange={(e) => {
              if (window.document) {
                const link = document.getElementById("link");
                setAudioLink(link.value);
              }
            }}
          >
            Submit
          </button>
        </div>
        <div
          style={{
            marginTop: "10px",
          }}
        >
          <label>
            Or upload an audio
            <input
              type="file"
              onChange={(e) => {
                console.log(e.target.files[0]);
                setAudioLink(URL.createObjectURL(e.target.files[0]));
              }}
            ></input>
          </label>
        </div>
      </div>
    );
}

export default Inputs