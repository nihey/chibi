import React from 'react';
import ReactDOM from 'react-dom';

require('sprite-js');

let Index = React.createClass({
  componentDidMount: function() {
    let sprites = [0, 1, 2, 3].map(function(index) {

      return new Sprite({
        canvas: ReactDOM.findDOMNode(this.refs['character-' + index]),
        image: ReactDOM.findDOMNode(this.refs.image),
        rows: 4,
        columns: 3,
        rowIndex: index,
        columnFrequency: 1,
      });
    }, this);

    setInterval(() => {
      sprites.forEach(function(sprite) {
        let canvas = sprite.canvas;
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        sprite.draw(0, 0);
      }, this);
    }, 200);
  },

  render: function() {
    return <div>
      <div className="results">
        <div className="canvases">
          <div>
            <canvas ref="character-0" width="32" height="32"/>
            <canvas ref="character-1" width="32" height="32"/>
          </div>
          <div>
            <canvas ref="character-2" width="32" height="32"/>
            <canvas ref="character-3" width="32" height="32"/>
          </div>
        </div>
        <img ref="image" src={require('../assets/images/creator/bases/male/color-0.png')}/>
      </div>
      <div>
      </div>
    </div>;
  },
});

ReactDOM.render(<Index/>, document.getElementById('react-body'));
