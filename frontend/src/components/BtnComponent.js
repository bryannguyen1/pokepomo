function BtnComponent(props) {
    return (
      <div>
        {/* NOT STARTED */}
        {(props.status === 0)? 
          <button className="stopwatch-btn stopwatch-btn-gre"
          onClick={props.start}>Start</button> : ""
        }
        {/* ONGOING */}
        {(props.status === 1)? 
          <div>
            <button className="stopwatch-btn stopwatch-btn-red"
                    onClick={props.stop}>Stop</button>
            <button className="stopwatch-btn stopwatch-btn-yel"
                    onClick={props.reset}>Reset</button>
          </div> : ""
        }
        {/* PAUSED */}
       {(props.status === 2)? 
          <div>
            <button className="stopwatch-btn stopwatch-btn-gre"
                    onClick={props.resume}>Resume</button>
            <button className="stopwatch-btn stopwatch-btn-yel"
                    onClick={props.reset}>Reset</button>
          </div> : ""
        }
       
      </div>
    );
  }
  
  export default BtnComponent;