import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'

import { screenfull } from 'screenfull-react'

import ReactPlayer from '../index'
import Duration from './Duration'


class App extends Component {
  state = {
    url: 'https://',
    pip: false,
    playing: true,
    controls: false,
    light: false,
    volume: 0.8,
    muted: false,
    played: 0, 
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
    question: 0,
    questionTime: false,
    correctQuestion: false,
    inCorrectQuestion: false,
    points: 0,
    pointsAdded: 80,
    qTime1: 10,
    qTime2: 75.586,
    qTime3: 183.4,
    questionTitle: 'Symbiosis',
    q0: 'The sea anemone does not sting the clownfish',
    q1: 'The clownfish is immune to the poison'
  }
  load = url => {
    this.setState({
      url,
      played: 0,
      loaded: 0,
      pip: false
    })
  }
  handleStart = (episode) => {
    console.log('playing episode 1')
    let url
    if (episode != 2) {
      url = 'https://www.youtube.com/watch?v=rn6R4ncd2OU'
    } else {
      url = 'https://youtu.be/laksjfdljasdf'
    }
    this.load(url)
    // this.handlePlayPause()
    // this.handleClickFullscreen()
  }
  handlePlayPause = () => {
    this.setState({ playing: !this.state.playing })
  }
  handleStop = () => {
    this.setState({ url: null, playing: false })
  }
  handleToggleControls = () => {
    const url = this.state.url
    this.setState({
      controls: !this.state.controls,
      url: null
    }, () => this.load(url))
  }
  handleToggleLoop = () => {
    this.setState({ loop: !this.state.loop })
  }
  handleVolumeChange = e => {
    this.setState({ volume: parseFloat(e.target.value) })
  }
  handleToggleQuestionTime = () => {
    this.setState({ questionTime: !this.state.questionTime })
  }
  handleToggleCorrectQuestion = () => {
    this.setState({ correctQuestion: !this.state.correctQuestion })
  }
  handleToggleInCorrectQuestion = () => {
    this.setState({ inCorrectQuestion: !this.state.inCorrectQuestion })
  }
  handleToggleMuted = () => {
    this.setState({ muted: !this.state.muted })
  }
  handleSetPlaybackRate = e => {
    this.setState({ playbackRate: parseFloat(e.target.value) })
  }
  handleOnPlaybackRateChange = (speed) => {
    this.setState({ playbackRate: parseFloat(speed) })
  }
  handleTogglePIP = () => {
    this.setState({ pip: !this.state.pip })
  }
  handlePlay = () => {
    console.log('onPlay')
    this.setState({ playing: true })
  }
  handleEnablePIP = () => {
    console.log('onEnablePIP')
    this.setState({ pip: true })
  }
  handleDisablePIP = () => {
    console.log('onDisablePIP')
    this.setState({ pip: false })
  }
  handlePause = () => {
    console.log('onPause')
    this.setState({ playing: false })
  }
  handlePoints = (p) => {
    console.log('AddsPoints')
    this.setState({ points: p })
  }
  handleSeekMouseDown = e => {
    this.setState({ seeking: true })
  }
  handleSeekChange = e => {
    this.setState({ played: parseFloat(e.target.value) })
  }
  handleSeekMouseUp = e => {
    this.setState({ seeking: false })
    this.player.seekTo(parseFloat(e.target.value))
  }
  handleEnded = () => {
    console.log('onEnded')
    this.setState({ playing: this.state.loop })
  }
  handleDuration = (duration) => {
    console.log('onDuration', duration)
    this.setState({ duration })
  }
  handleClickFullscreen = () => {
    screenfull.request(findDOMNode(this.player))
  }
  renderLoadButton = (url, label) => {
    return (
      <button onClick={() => this.load(url)}>
        {label}
      </button>
    )
  }
  secondsPlayed = () => {
    Math.round(this.state.played * this.state.duration)
  }
  handleProgress = (state, handle) => {
    console.log('onProgress', state)
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state)
    }  
    // Question Time based on qTime set in state and if the question is the current question.
    if (this.state.played * this.state.duration > this.state.qTime1 & this.state.question == 0) {
      this.questionTime(4)
    } 
    if (this.state.played * this.state.duration > this.state.qTime2 & this.state.question == 1) {
      this.questionTime(4)    
    }
    if (this.state.played * this.state.duration > this.state.qTime3 & this.state.question == 2) {
      this.questionTime(4)
    }
  }
  questionTime = (timeAmount) => {
    this.handleToggleQuestionTime()
    this.setState({question: +1 })
    console.log('Showing overlay')
    if (this.state.played > this.state.played + timeAmount) {
      this.handleToggleQuestionTime()
    }
    this.handleToggleMuted()
    if (this.state.questionTime && this.state.played > this.state.qTime1 + timeAmount ) {
      console.log('Seeking back to 10 seconds before')
      if (this.state.played < timeAmount ) {
        this.player.seekTo(.1)
      } else {
        this.player.seekTo(this.state.played - timeAmount)
      }
    }
  }
  answerQuestion = (q) => {
    if (q) {
      // Not correct answer
      this.handlePlayPause()
      setTimeout(this.handleToggleInCorrectQuestion, 1000)
      setTimeout(this.handleToggleQuestionTime, 1000)
      setTimeout(this.handleToggleMuted, 1000)
      
    } else {
      // Correct Answer
        this.setState({ points: this.state.points + this.state.pointsAdded }) //Add points
        setTimeout(
          this.handleToggleCorrectQuestion, 1000,
          this.handleToggleQuestionTime, 1000,
          this.handleToggleMuted, 1000,
        )
    } 
    switch(this.state.question) {
      case 2:
        this.setState({ q0: 'The sea anemone does not sting the clownfish',
                        q1: 'The clownfish is immune to the poison' })
        break;
      case 3:
        this.setState({ q0: 'She is the boss because she is the <strong>oldest</strong>',
                        q1: 'If the ke' })
        break;
      default:
        this.setState({ q0: 'The sea anemone does not sting the clownfish',
                        q1: 'The clownfish is immune to the poison' })
    }
  }
  ref = player => {
    this.player = player
  }

  render () {
    const { url, playing, controls, light, volume, muted, loop, played, loaded, duration, playbackRate, pip, questionTime, questionTitle, points, question, correctQuestion, inCorrectQuestion, q0, q1 } = this.state
    const SEPARATOR = ' · '

    return (
      <div className='app'>
        <h1 className="text-white text-center fot-bold text-3xl mt-20">
              {questionTitle}
        </h1>
        <h2 className="text-white left-60 top-20 absolute block">Points: {points}</h2>
         <div className={`${questionTime ? "fixed": "hidden"} overlay`} >
          <div>
            <button className="py-2 px-7 font-medium border-2 border-white background-white rounded-md text-base w-fit
              md:text-xl tracking-wide duration-300 z-50" onClick={() => this.answerQuestion(0)}>
              {q0}
              </button>
            <button className="py-2 px-7 font-medium border-2 border-white background-white rounded-md text-base w-fit
              md:text-xl tracking-wide duration-300 z-50" onClick={() => this.answerQuestion(1)}>
              {q1}
            </button>
          </div>
        </div>
        <div className={`${correctQuestion ? "fixed": "hidden"} overlay`}>
          <div>
            <h1 className="text-3xl text-white center animate-pulse">{this.state.points}</h1>
            <h2 className="text-white animate-ping">You are correct 🐠🐠</h2>
          </div>
        </div>
        <div className={`${inCorrectQuestion ? "fixed": "hidden"} overlay`}>
          <div>
            <h1 className="text-3xl text-white center animate-pulse">{this.state.points}</h1>
            <h2 className="text-white animate-ping">incorrect 🐠🐠</h2>
          </div>
        </div>
        <div className='flex'>
          <div className={`${played > 0 ? "invisible" : "block"} my-20 flex-1`} >
            <button className="py-2 px-7 font-medium border-2 border-white bg-white rounded-md text-base text-black
              md:text-xl tracking-wide duration-300 z-50" onClick={() => this.handleStart(1)}>Start Episode 1
            </button>
          </div>
          <p className="text-white">{this.state.played * this.state.duration}</p>
        </div>

        <div className='flex gap-20 opacity-30'>  
          <table>
            <tbody>
              <tr>
                <th>Controls</th>
                <td>
                  <button onClick={this.handleStop}>Stop</button>
                  <button onClick={this.handlePlayPause}>{playing ? 'Pause' : 'Play'}</button>
                  <button onClick={this.handleClickFullscreen}>Fullscreen</button>
                  {light &&
                    <button onClick={() => this.player.showPreview()}>Show preview</button>}
                  {ReactPlayer.canEnablePIP(url) &&
                    <button onClick={this.handleTogglePIP}>{pip ? 'Disable PiP' : 'Enable PiP'}</button>}
                </td>
              </tr>
              <tr>
                <th>Speed</th>
                <td>
                  <button onClick={this.handleSetPlaybackRate} value={1}>1x</button>
                  <button onClick={this.handleSetPlaybackRate} value={1.5}>1.5x</button>
                  <button onClick={this.handleSetPlaybackRate} value={2}>2x</button>
                </td>
              </tr>
              <tr>
                <th>Seek</th>
                <td>
                  <input
                    type='range' min={0} max={0.999999} step='any'
                    value={played}
                    onMouseDown={this.handleSeekMouseDown}
                    onChange={this.handleSeekChange}
                    onMouseUp={this.handleSeekMouseUp}
                  />
                </td>
              </tr>
              <tr>
                <th>Volume</th>
                <td>
                  <input type='range' min={0} max={1} step='any' value={volume} onChange={this.handleVolumeChange} />
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor='controls'>Controls</label>
                </th>
                <td>
                  <input id='controls' type='checkbox' checked={controls} onChange={this.handleToggleControls} />
                  <em>&nbsp; Requires player reload</em>
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor='muted'>Muted</label>
                </th>
                <td>
                  <input id='muted' type='checkbox' checked={muted} onChange={this.handleToggleMuted} />
                </td>
              </tr>
              <tr>
                <th>
                  <label htmlFor='loop'>Loop</label>
                </th>
                <td>
                  <input id='loop' type='checkbox' checked={loop} onChange={this.handleToggleLoop} />
                </td>
              </tr>
              <tr>
                <th>Played</th>
                <td><progress max={1} value={played} /></td>
              </tr>
              <tr>
                <th>Loaded</th>
                <td><progress max={1} value={loaded} /></td>
              </tr>
            </tbody>
          </table>
          <table>
            <tbody>
              <tr>
                <th>questionTime</th>
                <td>
                  {questionTime ? 'true' : 'false'}
                </td>
              </tr>
              <tr>
                <th>question</th>
                <td>{question}</td>
              </tr>
              <tr>
                <th>url</th>
                <td className={!url ? 'faded' : ''}>
                  {(url instanceof Array ? 'Multiple' : url) || 'null'}
                </td>
              </tr>
              <tr>
                <th>playing</th>
                <td>{playing ? 'true' : 'false'}</td>
              </tr>
              <tr>
                <th>volume</th>
                <td>{volume.toFixed(3)}</td>
              </tr>
              <tr>
                <th>speed</th>
                <td>{playbackRate}</td>
              </tr>
              <tr>
                <th>played</th>
                <td>{played.toFixed(3)}</td>
              </tr>
              <tr>
                <th>loaded</th>
                <td>{loaded.toFixed(3)}</td>
              </tr>
              <tr>
                <th>duration</th>
                <td><Duration seconds={duration} /></td>
              </tr>
              <tr>
                <th>elapsed</th>
                <td><Duration seconds={duration * played} /></td>
              </tr>
              <tr>
                <th>remaining</th>
                <td><Duration seconds={duration * (1 - played)} /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='player-wrapper absolute pointer-events-none h-screen w-screen -z-1 left-0 top-0'>
            <ReactPlayer
              ref={this.ref}
              className='react-player'
              width='100%'
              height='100%'
              url={url}
              pip={pip}
              playing={playing}
              controls={controls}
              light={light}
              loop={loop}
              playbackRate={playbackRate}
              volume={volume}
              muted={muted}
              onReady={() => console.log('onReady')}
              onStart={() => console.log('onStart')}
              onPlay={this.handlePlay}
              onEnablePIP={this.handleEnablePIP}
              onDisablePIP={this.handleDisablePIP}
              onPause={this.handlePause}
              onBuffer={() => console.log('onBuffer')}
              onPlaybackRateChange={this.handleOnPlaybackRateChange}
              onSeek={e => console.log('onSeek', e)}
              onEnded={this.handleEnded}
              onError={e => console.log('onError', e)}
              onProgress={this.handleProgress}
              onDuration={this.handleDuration}
            />
          </div>
      </div>
    )
  }
}

export default (App)
