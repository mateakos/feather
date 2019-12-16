import MediaDevice from './MediaDevice';
import EventEmitter from './EventEmitter';
import socket from './socket';

const PC_CONFIG = {iceServers: [{urls: ['stun:sting.l.google.com:19302']}]};

class PeerConnection extends EventEmitter {
    /**
     * Create a PeerConnection.
     * @param {String} remotePartyId - Id of the remote party you want to call.
     */
    constructor(remotePartyId){
        super();
        this.pc = new RTCPeerConnection(PC_CONFIG);
        this.pc.onicecandidate = event => socket.emit('call',{
            to: this.remotePartyId,
            candidate: event.candidate
        });
        this.pc.onaddstrean = event => this.emit('peerStream', event.stream);
        this.mediaDevice = new MediaDevice();
        this.remotePartyId = remotePartyId;
    }

    start(isCaller, config){
        this.mediaDevice
            .on('stream', (stream) =>{
                this.pc.addStream(stream);
                this.emit('localStream', stream);
                if (isCaller) {
                    socket.emit('request', { to: this.remotePartyId });
                } else {
                    this.createOffer()
                }
            })//<-event emitter on
            .start(config);
        return this;
    }

    /**
   * Stop the call
   * @param {Boolean} isInitiator
   */
    stop(isInitiator) {
        if (isInitiator) 
            socket.emit('end', { to: this.remotePartyId });
        this.mediaDevice.stop();
        this.pc.close();
        this.pc = null;
        this.off();
        return this;
    }

    /**
   * Creation an SDP offer for the purpose of starting a new WebRTC connection to a remote peer
   */
    createOffer() {
        this.pc.createOffer()
            .then(this.getDescription.bind(this))
            .catch(err => console.log(err));
        return this;
    }

    /**
     * Creates an SDP answer to an offer received from a remote peer during the offer/answer negotiation of a WebRTC connection.
     */
    createAnswer() {
        this.pc.createAnswer()
            .then(this.getDescription.bind(this))
            .catch(err => console.log(err));
        return this;

    }

    getDescription(desc) {
        this.pc.setLocalDescription(desc);
        socket.emit('call', 
            { 
                to: this.remotePartyId, 
                sdp: desc
             });
        return this;
    }

    /**
    * @param {Object} sdp - Session description
    */
    setRemoteDescription(sdp) {
        const rtcSdp = new RTCSessionDescription(sdp);
        this.pc.setRemoteDescription(rtcSdp);
        return this;
    }

    /**
     * @param {Object} candidate - ICE Candidate
     */
    addIceCandidate(candidate) {
        if (candidate) {
            const iceCandidate = new RTCIceCandidate(candidate);
            this.pc.addIceCandidate(iceCandidate);
        }
        return this;
    }
}

export default PeerConnection;