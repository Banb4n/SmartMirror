import React from 'react';
import Clock from '../components/Clock';
import Weather from '../components/Weather';
import Forecast from '../components/Forecast'
import News from '../components/News';
import RecordingStatus from '../components/RecordingStatus';
import Message from '../components/Message';
import Tasks from '../components/Tasks';
import Article from '../components/Article';
import TemperatureGraph from '../components/TemperatureGraph';
import BounceGame from '../components/BounceGame';

import { config } from '../config.js';

import { Col, Row } from 'react-bootstrap';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    let s = new WebSocket('ws://' + config.wsServerBaseURL);
    s.onmessage = this.handleMessage.bind(this);
    s.addEventListener('error', m => console.log(m));
    s.addEventListener('open', m => {
      console.log(m);
      s.send({event: 'connect', data: 'Hey there'});
    });
    this.state = {
      temperature: '22.6',
      isRecording: false,
      message: {
        text: 'No messages set',
        visible: false
      },
      visibility: {
        news: true,
        forecasts: true,
        article: false,
        tasks: true,
        weather: true,
        clock: true,
        temperatureGraph: false,
      }
    };

  }

  handleMessage(message) {
    message = JSON.parse(message.data);
    console.log('new message', message);
    const data = message.data;
    switch(message.event){
      case 'temperature':
        this.setState({
          temperature: data.temperature
        })
        break;
      case 'recording':
        this.setState({
          isRecording: message.data.isRecording
        })
        break;
      case 'motion':
        if(!this.state.message.visible){
          this.setState({
            message: {
              text: data.message,
              visible: true
            }
          })
          setTimeout(() => {
            this.setState({
              message: {
                visible: false
              }
            })
          }, 10000)
        }
        break;
      case 'visibility':
        const prevStateVisability = this.state.visibility;
        prevStateVisability[data.component] = data.visible;
        this.setState({
          visibility: prevStateVisability
        })
        break;
      case 'command':
        this.refs[data.component].onEvent(data);
        break;
      default:
        console.log('Unhandled event: ' + message.event);
        break;
    }
  }

  render() {
    console.log('redniging app')
    return (
      <div style={{fontFamily: 'Sawasdee', fontWeight: 500}} className='App'>
        <BounceGame/>
        <div style={{position: 'absolute', top: 0, width: '100%', height: '100%', paddingLeft: 80, paddingRight: 60, paddingTop: 45}}>
          <Article ref='article' visible={this.state.visibility.article} />
          <TemperatureGraph ref='temperatureGraph' visible={this.state.visibility.temperatureGraph} />
          <Row>
            <Col xs={4}>
              <Clock temperature={this.state.temperature} visible={this.state.visibility.clock}/>
              <RecordingStatus isRecording={this.state.isRecording} />
              <Tasks visible={this.state.visibility.tasks} />

            </Col>
            <Col xs={4} />
            <Col xs={4}>
              <Row>
                <Weather visible={this.state.visibility.weather} />
              </Row>
              <Row style={{marginTop: 50}}>
                <Forecast visible={this.state.visibility.forecasts} />
              </Row>
            </Col>
          </Row>
          <Row style={{height: '1%'}}/>
          <Row style={{marginBottom: 100, marginTop: 50}}>
            <Message props={{visible: this.state.message.visible, message: this.state.message.text}}/>
          </Row>
          <Row style={{position: 'absolute', bottom: '0px', left: '0px', width: '100%', padding: 60, paddingBottom: 0}}>
            <News visible={this.state.visibility.news} />
          </Row>
        </div>
      </div>
    );
  }
}
