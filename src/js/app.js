import React, { Component } from 'react';
import {render} from 'react-dom';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import IconButton  from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';

import socket from './socket';
import MainWindow from './MainWindow';
import PeerConnection from './PeerConnection';
import CallModal from './CallModal';
import CallWindow from './CallWindow';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            clientId: '',
            callWindow: '',
            callModal: '',
            callFrom: '',
            localSrc: null,
            peerSrc: null,
        }
        this.pc = {};
        this.config = null;
        this.startCallHandler = this.startCall.bind(this);
        this.endCallHandler = this.endCall.bind(this);
        this.rejectCallHandler = this.rejectCall.bind(this);
    }

    componentDidMount(){
        socket
        .on('init', data => this.setState({ clientId: data.id}))
        .on('request', data => this.setState({ callModal: 'active', callFrom: data.from }))
        .on('call', (data) => { console.log(`Call from ${data.from}`)})
        .on('end', this.endCall.bind(this, false))
        .emit('init');
    }

    startCall(isCaller, remotePartyId, config) {
        this.config = config;
        this.pc = new PeerConnection(remotePartyId)
          .on('localStream', (src) => {
            const newState = { callWindow: 'active', localSrc: src };
            if (!isCaller) newState.callModal = '';
            this.setState(newState);
          })
          .on('peerStream', src => this.setState({ peerSrc: src }))
          .start(isCaller, config);
    }

    rejectCall() {
        const {callFrom } = this.state;
        socket.emit('end', { to: callFrom });
        this.setState({ callModal: '' });
    }
    
    endCall(isStarter) {
        if (typeof this.pc.stop === 'function') 
            this.pc.stop(isStarter);
        this.pc = {};
        this.config = null;
        this.setState({
            callWindow: '',
            localSrc: null,
            peerSrc: null
        });
    }

    render(){
        const { clientId, callFrom, callModal, callWindow, localSrc, peerSrc } = this.state;
        return (
            <div>
                <AppBar position="static" style={{ background: 'transparent', boxShadow: 'none'}}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <i
                                className="fa fa-video-camera"
                            />
                        </IconButton>
                        <Typography variant="h6" className="navbar-brand">
                            Conf Call <span> •  {clientId}</span>
                        </Typography>
                    </Toolbar>
                </AppBar>
                <MainWindow clientId={clientId} startCall={this.startCallHandler} />
                <CallWindow status={callWindow} localSrc={localSrc} peerSrc={peerSrc} 
                    config={this.config} mediaDevice={this.pc.mediaDevice} endCall={this.endCallHandler} />
                <CallModal status={callModal} startCall={this.startCallHandler} rejectCall={this.rejectCallHandler} callFrom={callFrom} />
            </div>
        );
    }
}

render(<App/>, document.getElementById('root'))