import React, { useState, useEffect } from 'react'
import {
  unstable_HistoryRouter as HistoryRouter,
  Routes,
  Route
} from 'react-router-dom'
import Home from './pages/Home/Home'
import TodoPage from './pages/TodoPage'
import history from './BrowserHistory'
import './App.css'
import { connect } from 'react-redux'
import { authUserRequest } from './actions/actionCreator'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AuthByQRCode from './pages/AuthByQRCode'
import GridLoader from 'react-spinners/GridLoader'

function App (props) {
  useEffect(() => {
    setTimeout(() => {
      if (!props.user) {
        props.authUserRequest()
      }
    }, 1000)
  }, [])

  useEffect(() => {
    //const {notification: {notification}} = props;
    if (props.notification) {
      toast.info(props.notification.notification, {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
      })
    }
  }, [props.notification])

  return (
    <HistoryRouter history={history}>
      <ToastContainer
        position='bottom-left'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
      />

      <GridLoader
        color='#36d7b7'
        size={150}
        cssOverride={{
          display: 'block',
          margin: '0 auto'
        }}
        loading={props.isFetching}
      />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/tasks/' element={<TodoPage />} />
        <Route path='/authByQR/' element={<AuthByQRCode />} />
      </Routes>
    </HistoryRouter>
  )
}

const mapStateToProps = ({ isFetching, user, notification }) => ({
  isFetching,
  user,
  notification
})

const mapDispatchToProps = {
  authUserRequest
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
