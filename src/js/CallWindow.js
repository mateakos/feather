import React, {Component} from 'react';
import PropTypes from 'proptypes';
import classnames from 'classnames';

class CallWindow extends Component {
    constructor(props){
        super(props);
        this.state = {
            Video: true,
            Audio: true,
        };

        this.btns = [
            { type: 'Video', icon: 'fa-video-camera' },
            { type: 'Audio', icon: 'fa-microphone' },
        ]
    }

    componentDidMount(){
        this.setMediaStream();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { config: currentConfig } = this.props;
        // Initialize when the call started
        if (!currentConfig && nextProps.config) {
            const { config, mediaDevice } = nextProps;

            for(let type in config){
                mediaDevice.toggle(type.charAt(0).toUpperCase() + type.substring(1), config[type]);
             }

            this.setState({
                Video: config.video,
                Audio: config.audio
            });
        }
    }
    
    componentDidUpdate() {     
        this.setMediaStream();
    }

    setMediaStream() {
        const { peerSrc, localSrc } = this.props;
        if (this.peerVideo && peerSrc) this.peerVideo.srcObject = peerSrc;
        if (this.localVideo && localSrc) this.localVideo.srcObject = localSrc;
    }

    getDeviceState(option){
        if ((this.state == null) || (this.state === 'undefined'))
            return null;
        return this.state[option];    
    }
    /**
     * Turn on/off a media device
     * @param {String} deviceType - Type of the device eg: Video, Audio
     */
    toggleMediaDevice(deviceType) {
        const { mediaDevice } = this.props;
        //const deviceState = _.get(this.state, deviceType);
        const deviceState = this.getDeviceState(deviceType);
        console.log(`Device type ${deviceType} state ${deviceState}`);
        this.setState({ [deviceType]: !deviceState });
        mediaDevice.toggle(deviceType);
    }

    renderControlButtons() {
        const getClass = (icon, type) => classnames(`btn-action fa ${icon}`, {
            //disable: !_.get(this.state, type)
            disable: !this.getDeviceState(type)
            });

        return this.btns.map(btn => (
            <button
                key={`btn${btn.type}`}
                type="button"
                className={getClass(btn.icon, btn.type)}
                onClick={() => this.toggleMediaDevice(btn.type)}
            />
        ));
    }

    render(){
        const { status, endCall } = this.props;
        return (
            <div className={classnames('call-window', status)}>
                <video id="peerVideo" ref={el => this.peerVideo = el} autoPlay />
                <video id="localVideo" ref={el => this.localVideo = el} autoPlay muted />
                <div className="video-control"> 
                    {this.renderControlButtons()}
                    <button
                        type="button"
                        className="btn-action hangup fa fa-phone"
                        onClick={() => endCall(true)}
                    />
                </div>
            </div>);
    }
}

CallWindow.propTypes = {
    status: PropTypes.string.isRequired,
    localSrc: PropTypes.object, // eslint-disable-line
    peerSrc: PropTypes.object, // eslint-disable-line
    config: PropTypes.object, // eslint-disable-line
    mediaDevice: PropTypes.object, // eslint-disable-line
    endCall: PropTypes.func.isRequired
}

export default CallWindow;