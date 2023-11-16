import { useEffect, useRef } from 'react'
import Experience from './experience/Experience'
import './App.css'

function App()
{
  // const [count, setCount] = useState(0)

  const canvasRef = useRef<any>(null);

  useEffect(() =>
  {
    new Experience({
      targetElement: canvasRef.current
    })
  }, [canvasRef]);

  return (
    <>
      <div ref={canvasRef} style={{ width: '100%', height: '100%' }} ></div>
    </>
  )
}

export default App
