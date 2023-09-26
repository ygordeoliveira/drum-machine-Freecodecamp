import './App.css';
import React, { Component } from 'react';

class DrumPad extends Component {
    constructor(props) {
        super(props);
        this.audioRef = React.createRef();
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }

    handleKeyPress = (event) => {
        if (event.key.toUpperCase() === this.props.keyTrigger && this.props.power) {
                this.playSound();
        }
    };

    playSound = () => {
        if (this.props.power) {
            const audio = this.audioRef.current;
            audio.currentTime = 0;
    
            // Ajuste o volume com base no valor do controle deslizante (0 a 1)
            const adjustedVolume = this.props.volume / 100;
            audio.volume = adjustedVolume;
    
            audio.play();
            this.props.updateDisplay(this.props.name);
        }
    };

    render() {
        return (
            <button
                className={`drum-pad btn btn-secondary p-3 m-3 mt-4 text-dark ${this.props.power ? 'active' : ''}`}
                onClick={this.playSound}
            >
                {this.props.keyTrigger}
                <audio ref={this.audioRef} src={this.props.audioSrc}/>
            </button>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            power: false,
            display: '',
            volume: 50
        };
    }

    handlePowerToggle = () => {
        this.setState((prevState) => ({
            power: !prevState.power,
            display: ''
        }));
    };

    handleTurnOff = () => {
        this.setState({
            power: false,
            display: ''
        });
    };

    updateDisplay = (name) => {
        this.setState({
            display: name
        });
    };

    render() {
        const drumPads = [
            { keyTrigger: 'Q', audioSrc:  "https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3", name: 'Chord 1' },
            { keyTrigger: 'W', audioSrc:"https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3", name: 'Chord 2' },
            { keyTrigger: 'E', audioSrc:"https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3", name: 'Chord 3' },
            { keyTrigger: 'A', audioSrc:"https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3", name: 'Shaker' },
            { keyTrigger: 'S', audioSrc:"https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3", name: 'Open HH' },
            { keyTrigger: 'D', audioSrc: "https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3", name: 'Closed HH' },
            { keyTrigger: 'Z', audioSrc: "https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3", name: 'Punchy Kick' },
            { keyTrigger: 'X', audioSrc: "https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3", name: 'Side Stick' },
            { keyTrigger: 'C', audioSrc:"https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3", name: 'Snare' },
        ];

        return (
            <div className="row"> 
                <div className="col-md-4">
                    <div className={`pad-container ${this.state.power ? 'active' : 'disable'}`}>
                        {drumPads.map((pad, index) => (
                            <DrumPad
                                key={index}
                                keyTrigger={pad.keyTrigger}
                                audioSrc={pad.audioSrc}
                                name={pad.name}
                                power={this.state.power}
                                volume={this.state.volume}
                                updateDisplay={this.updateDisplay}
                            />
                        ))}
                    </div>
                </div>
                <div className="col-md-6 offset-md-2">
                    <div className="controls m-3">
                        {this.state.power ? (
                            <button className={`btn btn-danger mt-3`} onClick={this.handleTurnOff}>
                                Desligar
                            </button>
                        ) : (
                            <button className={`btn btn-success`} onClick={this.handlePowerToggle}>
                                Ligar
                            </button>
                        )}
                        {this.state.power && (
                            <div className="volume-control mt-4">
                                <label class="fs-4">Volume</label>
                                <input
                                    className="m-2"
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={this.state.volume}
                                    disabled={!this.state.power}
                                    onChange={(e) => {
                                        const newVolume = e.target.value;
                                        this.setState({ volume: newVolume })}}
                                />
                                <br/>
                                <br/>
                                <p class="volume fs-4">Volume: {this.state.volume}</p>
                            </div>
                        )}
                        <div className="display bg-secondary w-75 text-center">
                            <p>{this.state.display}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;