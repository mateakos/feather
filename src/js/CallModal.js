import React, {Component} from 'react';
import PropTypes from 'proptypes'
import classnames from 'classnames'

class CallModal extends Component {
    constructor(props){
        super(props);
    }

    acceptWithVideo(video) {
        const { callFrom, startCall } = this.props;
        const config = { audio: true, video };
        return () => startCall(false, callFrom, config);
    }

    render(){
        const { status, callFrom, rejectCall } = this.props;
        return(
            <div className={classnames('call-modal', status)}>
                <span className="caller">{`${callFrom} is calling`}</span>
                <button type="button" className="btn-action fa fa-video-camera"
                    onClick={this.acceptWithVideo(true)}/>
                <button type="button" className="btn-action fa fa-phone"
                    onClick={this.acceptWithVideo(false)}/>
                <button type="button" className="btn-action hangup fa fa-phone"
                    onClick={rejectCall}/>
            </div>
        );
    }
}

CallModal.propTypes = {
    status: PropTypes.string.isRequired,
    callFrom: PropTypes.string.isRequired,
    startCall: PropTypes.func.isRequired,
    rejectCall: PropTypes.func.isRequired
};

export default CallModal;