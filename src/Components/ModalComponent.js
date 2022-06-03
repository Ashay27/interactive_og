import React, { Component } from 'react';
import M from "materialize-css";
import "/node_modules/materialize-css/dist/js/materialize.min.js";

export class ModalComponent extends Component {
    componentDidMount(){
        const options = {
          opacity: 0.6,
          preventScrolling: false
        };
    
        M.Modal.init(this.ModalComponent, options);
      }
      
      Form(){
        return (
            <div>
                <input type = "text" placeholder = "Enter Text.." />
                <br />
                <br />
                <input type = "text" placeholder = "Enter Text.." />
                <br />
                <br />
                <button type = "submit">Submit</button>
            </div>
        );
      }
    
      render() {
        const modal = this.props.showModal ? <div><input type = "text" placeholder = "Enter Text.." /></div> : null;
        return(
          <>
          {modal}
          
            <button className="btn modal-trigger red"
            data-target="modal1"> Pipe </button>
          
            <div ref={ModalComponent => { this.ModalComponent = ModalComponent; }} 
            className="modal-content" id = "modal1" onClick={this.Form}>
                    <div>
                <input type = "text" placeholder = "Enter Text.." />
                <br />
                <br />
                <input type = "text" placeholder = "Enter Text.." />
                <br />
                <br />
                <button type = "submit">Submit</button>
            </div>
           </div>
           </>
        )
      }
}

export default ModalComponent