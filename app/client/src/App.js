import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { getInitialData } from './actions/intialData'
import styled from 'styled-components'
import './App.css';

import ContentNav from './components/layout/ContentNav'
import Content from './components/layout/Content';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

function App() {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getInitialData('areas'))
    dispatch(getInitialData('levels'))
    dispatch(getInitialData('teams'))
    dispatch(getInitialData('info'))
  }, []);

  return(
    <Container>
      <ContentNav />
      <Content />
    </Container>
  )
}

export default App;
