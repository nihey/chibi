import React from 'react';

// Props to: https://codepen.io/imathis/pen/ZYEWrw
export default function TetroLoader(props) {
  return <div className={"tetrominos " + (props.className || '')}>
    <div className="tetromino box1"/>
    <div className="tetromino box2"/>
    <div className="tetromino box3"/>
    <div className="tetromino box4"/>
  </div>;
}
