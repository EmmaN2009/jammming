import React from 'react';
import './Track.css';

class Track extends React.Component {
  constructor(props){
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  addTrack(event){
    return this.props.onAdd(this.props.track);
  }

  removeTrack(event){
    return this.props.onRemove(this.props.track);
  }


  renderAction(){
    if(this.props.onRemove) {
      return <a className="Track-action"
                onClick={this.removeTrack}>
                <p>-</p>
              </a>
    } else {
      return <a className="Track-action"
                onClick={this.addTrack}>
                <p>+</p>
            </a>
          }
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p>{this.props.track.artist} | {this.props.track.album}</p>
        </div>
        {this.renderAction()}
      </div>
  )}
}
export default Track;
