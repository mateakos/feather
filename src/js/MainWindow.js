import React, {Component } from 'react';
import PropTypes from 'proptypes';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';

let remotePartyId;

class MainWindow extends Component {

   /**
   * Start the call with or without video
   * @param {Boolean} video
   */
    callWithVideo(video) {
        const { startCall } = this.props;
        const config = { audio: true, video };
        return () => startCall(true, remotePartyId, config);
    }


    render(){
        
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm">&nbsp;</div>
                    <div className="col-sm">&nbsp;</div>
                    <div className="col-sm">
                        <Paper className="main-window">
                            <Typography variant="h3" component="h3">Meet with <span>&nbsp;</span>
                                <TextField id="partner" label="Partner Id" variant="outlined" onChange = {event => remotePartyId = event.target.value} />
                            </Typography>
                            &nbsp;
                            <Divider />
                            <Container className="btn-container">
                                <IconButton className="btn-action" aria-label="Video" onClick={this.callWithVideo(true)}>
                                    <i className="fa fa-video-camera" />
                                </IconButton>
                                <IconButton className="btn-action" aria-label="Audio" onClick={this.callWithVideo(false)}>
                                    <i className="fa fa-phone" />
                                </IconButton>
                            </Container>
                        </Paper>
                    </div>
                </div>
            </div>
        );
    }
}

MainWindow.propTypes = {
    clientId: PropTypes.string.isRequired,
    startCall: PropTypes.func.isRequired
};

export default MainWindow;