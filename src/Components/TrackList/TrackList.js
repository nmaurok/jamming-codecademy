import React, { Component } from 'react';
import './TrackList.css';
import { Track } from '../Track/Track.js';

class TrackList extends React.Component {
  render(){
    return (
      <div className="TrackList">
        this.props.tracks.map((track) =>
          return <Track track={track} key={track.id} onAdd={this.props.onAdd} isRemoval={this.props.isRemoval} onRemove={this.props.onRemove} />
        )

        <p>{this.props.track.name}</p>
        <p>{this.props.track.artist}</p>
        <p>{this.props.track.album}</p>
      </div>
    )
  }
}

export default TrackList;
