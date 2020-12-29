import React, { Component } from 'react'
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

export default class App extends Component {
  render () {
    return (
      <div className='app'>
        <h1>Hello World!</h1>
        <p>
            We are using nodes
            <script>document.write(process.versions.node)</script>,
            Chrome
            <script>document.write(process.versions.chrome)</script>,
            and Electron
            <script>document.write(process.versions.electron)</script>.
        </p>
            <Button variant="info">test btn</Button>
      </div>
    )
  }
}