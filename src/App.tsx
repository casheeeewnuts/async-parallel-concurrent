import {useCallback, useMemo, useState} from 'react'
import './App.css'
import {asyncFibonacci, fibonacci} from "./fib";
import FibWorker from "./fib-worker?worker";
import {wrap} from "comlink";

function App() {
  return (
    <div className="App">
      <h1>Parallel(Worker) vs. Concurrent(Async)</h1>
      <div className="container">
        <div className="card gc-2">
          <p>Sync</p>
          <Calculator/>
          <Counter/>
        </div>
        <div className="card gc-3">
          <p>Async</p>
          <AsyncCalculator/>
          <Counter/>
        </div>
        <div className="card gc-4">
          <p>Worker</p>
          <ParallelCalculator/>
          <Counter/>
        </div>
      </div>
    </div>
  )
}

function Counter({n = 0}) {
  const [count, setCount] = useState(n)

  return <button onClick={() => setCount((count) => count + 1)} className="border">
    count is {count}
  </button>
}

function Calculator() {
  const [num, setNum] = useState(0)
  const [fib, setFib] = useState(fibonacci(0))

  return (
    <div>
      <div>
        <input onChange={e => setNum(e.target.valueAsNumber)} value={num} type="number" min={0}/>
        <div style={{padding: "0.5em"}}>
          <button style={{background: "#213547", color: "white"}} onClick={() => setFib(fibonacci(num))}
                  disabled={Number.isNaN(num)}>calculate
          </button>
        </div>
      </div>
      <p>fibonacci number is {fib}</p>
    </div>
  )
}

function AsyncCalculator() {
  const [num, setNum] = useState(0)
  const [fib, setFib] = useState(fibonacci(0))

  const calcFib = useCallback(() => {
    asyncFibonacci(num).then(setFib)
  }, [num])

  return (
    <div>
      <div>
        <input onChange={e => setNum(e.target.valueAsNumber)} value={num} type="number" min={0}/>
        <div style={{padding: "0.5em"}}>
          <button style={{background: "#213547", color: "white"}} onClick={calcFib}
                  disabled={Number.isNaN(num)}>calculate
          </button>
        </div>
      </div>
      <p>fibonacci number is {fib}</p>
    </div>
  )
}

function ParallelCalculator() {
  const fibworker = useMemo(() => wrap<{fibonacci: (n: number) => number}>(new FibWorker()), [])

  const [num, setNum] = useState(0)
  const [fib, setFib] = useState(fibonacci(0))

  const calcFib = useCallback(() => {
    fibworker.fibonacci(num).then(setFib)
  }, [num])

  return (
    <div>
      <div>
        <input onChange={e => setNum(e.target.valueAsNumber)} value={num} type="number" min={0}/>
        <div style={{padding: "0.5em"}}>
          <button style={{background: "#213547", color: "white"}} onClick={calcFib}
                  disabled={Number.isNaN(num)}>calculate
          </button>
        </div>
      </div>
      <p>fibonacci number is {fib}</p>
    </div>
  )
}

export default App
