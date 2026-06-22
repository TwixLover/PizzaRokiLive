import { useState } from 'react'

import Header from '../components/Header.jsx'
import Local from '../components/Local.jsx'
import Footer from '../components/Footer.jsx'


function Index() {
  const [count, setCount] = useState(0)

  return (
    <div className='app'>
    < Header />
    < Local />
    < Footer />
    </div>
  )
}

export default Index;