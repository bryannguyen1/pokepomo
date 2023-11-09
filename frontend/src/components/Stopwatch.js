import {useState} from 'react';
import DisplayComponent from './DisplayComponent';
import BtnComponent from './BtnComponent';
import '../styling/Stopwatch.css';
import { useAuthContext } from '../hooks/useAuthContext';
import { useCreditsContext } from '../hooks/useCreditsContext';

function Stopwatch() {
  const [time, setTime] = useState({ms:0, s:0, m:0, h:0});
  const [interv, setInterv] = useState();
  const [status, setStatus] = useState(0);
  // Not started = 0
  // started = 1
  // stopped = 2

  const {user} = useAuthContext()
  const { dispatch } = useCreditsContext()

  const start = () => {
    run();
    setStatus(1);
    setInterv(setInterval(run, 10));
  };

  async function addCredits(num) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND}/api/credits`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify({addCredits: num})
    })
    const json = await response.json()
    
    if (response.ok) {
        //setCredits(json.credits)
        
        dispatch({type: 'SET_CREDITS', payload: json.credits})
    }
  }

  var updatedMs = time.ms, updatedS = time.s, updatedM = time.m, updatedH = time.h;

  const run = () => {
    if(updatedM === 60){
      updatedH++;
      updatedM = 0;
    }
    if(updatedS === 60){
      updatedM++;
      updatedS = 0;
      addCredits(1)
    }
    if(updatedMs === 100){
      updatedS++;
      updatedMs = 0;
    }
    updatedMs++;
    return setTime({ms:updatedMs, s:updatedS, m:updatedM, h:updatedH});
  };

  const stop = () => {
    clearInterval(interv);
    setStatus(2);
  };

  const reset = () => {
    clearInterval(interv);
    setStatus(0);
    setTime({ms:0, s:0, m:0, h:0})
  };

  const resume = () => start();


  return (
    <div className="main-section">
     <div className="clock-holder">
          <div className="stopwatch">
               <DisplayComponent time={time}/>
               <BtnComponent status={status} resume={resume} reset={reset} stop={stop} start={start}/>
          </div>
     </div>
    </div>
  );
}

export default Stopwatch;