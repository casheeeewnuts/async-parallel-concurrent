import {useCallback, useEffect, useMemo, useState} from 'react'
import './App.css'
import {asyncFibonacci, fibonacci} from "./fib";
import FibWorker from "./fib-worker?worker";
import {wrap} from "comlink";

function App() {
  return (
    <div className="App">
      <h1>Parallel vs Concurrent</h1>
      <Timer/>
      <div className="container">
        <div className="card gc-2">
          <p>Sync</p>
          <Calculator/>
          <Counter/>
        </div>
        <div className="card gc-3">
          <p>Concurrent (Async)</p>
          <AsyncCalculator/>
          <Counter/>
        </div>
        <div className="card gc-4">
          <p>Parallel (WebWorker)</p>
          <ParallelCalculator/>
          <Counter/>
        </div>
      </div>
    </div>
  )
}

function Timer() {
  const [datetime, setDatetime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setDatetime(new Date())
    }, 1000)
  }, [])

  return <p className="timer">{datetime.toLocaleTimeString()}</p>
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
  const [calculating, setCalculating] = useState(false)

  const calcFib = useCallback(() => {
    setCalculating(true)
    setFib(fibonacci(num))
    setCalculating(false)
  }, [num])

  return (
    <div>
      <div>
        <input onChange={e => setNum(e.target.valueAsNumber)} value={num} type="number" min={0}/>
        <div style={{padding: "0.5em"}}>
          <button className="calc" onClick={calcFib}
                  disabled={calculating || Number.isNaN(num)}>
            calculate
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
  const [calculating, setCalculating] = useState(false)

  const calcFib = useCallback(() => {
    setCalculating(true)
    asyncFibonacci(num).then(setFib).then(() => setCalculating(false))
  }, [num])

  return (
    <div>
      <div>
        <input onChange={e => setNum(e.target.valueAsNumber)} value={num} type="number" min={0}/>
        <div style={{padding: "0.5em"}}>
          <button className="calc"
                  onClick={calcFib}
                  disabled={calculating || Number.isNaN(num)}>
            {calculating ? "calculating" : "calculate"}
          </button>
        </div>
      </div>
      <p>fibonacci number is {fib}</p>
    </div>
  )
}

function ParallelCalculator() {
  const fibworker = useMemo(() => wrap<{ fibonacci: (n: number) => number }>(new FibWorker()), [])

  const [num, setNum] = useState(0)
  const [fib, setFib] = useState(fibonacci(0))
  const [calculating, setCalculating] = useState(false)

  const calcFib = useCallback(() => {
    setCalculating(true)
    fibworker.fibonacci(num).then(setFib).then(() => setCalculating(false))
  }, [num])

  return (
    <div>
      <div>
        <input onChange={e => setNum(e.target.valueAsNumber)} value={num} type="number" min={0}/>
        <div style={{padding: "0.5em"}}>
          <button className="calc"
                  onClick={calcFib}
                  disabled={calculating || Number.isNaN(num)}>
            {calculating ? "calculating" : "calculate"}
          </button>
        </div>
      </div>
      <p>fibonacci number is {fib}</p>
    </div>
  )
}

export default App
