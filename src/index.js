import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button
            className='square'
            onClick={props.onClick}
        >
        {props.highlight && 
          <div id="highlight">
            {props.value}
          </div> 
        }
        {!props.highlight &&
          <div>
            {props.value}
          </div>
        }
        </button>
    );
}
  
class Board extends React.Component {

    renderSquare(i,isHighlighten = false) {
      return (
            <Square 
                key={i.toString()}
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
                highlight = {isHighlighten}           
            />
            );
    }
  
    render() {

      const rowNumbers = [[0,1,2],[3,4,5],[6,7,8]];
      const colNumbers = [0,1,2]; 
      let highlightTrue = false;

      return (
        <div>
          {colNumbers.map((number,outerindex) => {
            return (
              <div className="board-row" key={number}>
                {rowNumbers[number].map((item,innerindex) => {
                  
                  highlightTrue = false;
                  if (this.props.winningSequence) {
                    highlightTrue = this.props.winningSequence.includes(item);
                  }
                  return (
                    this.renderSquare(item,highlightTrue)
                  )
                })}
              </div>
            )
          })}
        </div>
      );
    }
  }
  
class Game extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null), moveDescription: 'col,row',
            }],
            xIsNext: true,
            stepNumber: 0,
            sortState: false,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0,this.state.stepNumber +1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        
        const move_desc = [
          '1,1' , '2,1', '3,1', '1,2' , '2,2', '3,2', '1,3' , '2,3', '3,3',
        ]


        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                moveDescription: move_desc[i],
            }]),
            squares: squares,
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    sortHandler() {
      this.setState({
          sortState: !this.state.sortState
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step,move) => {
            
            const desc = move ?
                `Go to move #${move} (${step.moveDescription})` :
                'Go to game start (col,row)';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {move === this.state.stepNumber ? <b>{desc}</b> : desc}
                    </button>
                </li>
            );
        });
        
        
        let status;
        if (winner) {
            status = `Winner: ${winner[0]}`
          } else if (this.state.stepNumber >= 9) {
            status = `DRAW`
          } else {
            status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
            }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
                winningSequence = {winner ? winner[1] : null} // winner[1] - winning sequence
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <hr></hr>
            <div>
              <button onClick={ () => this.sortHandler()}>
                SORT {this.state.sortState ? "Descending" : "Ascending"}
              </button>
            </div>
            <ol>{this.state.sortState ? moves : moves.reverse()}</ol>
          </div>
        </div>
      );
    }
  }
  
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i =0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && 
            squares[a] === squares[b] &&
            squares[a] === squares[c]) {
            return [squares[a], lines[i]];
        }
    }
    return null
}

  // ========================================
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
  