import React, { Component } from 'react'
import ModalComponent from './ModalComponent';
import M from "materialize-css";
import "/node_modules/materialize-css/dist/js/materialize.min.js";

export class FABComponent extends Component {
    state = {
        showModal : false
      }
    
    showModalHandler = (event) =>{
        this.setState({showModal:true});
      }
    
    hideModalHandler = (event) =>{
        this.setState({showModal:false});
    }  
    
    componentDidMount() {
        const options = {
          hoverEnabled : false,
          inDuration: 300,
          outDuration: 200
        };
          
          M.FloatingActionButton.init(this.FABComponent, options);
    }

    
 
      render() {
        return(
         <div ref={FABComponent => { this.FABComponent = FABComponent; }} className="fixed-action-btn">
             <a className="btn-floating btn-large red">
                <span className="material-icons">add
                </span>
             </a>
           <ul>
             <li> <ModalComponent showModal={this.state.showModal} hideModalHandler={this.hideModalHandler}> </ModalComponent></li>
             <li><a className="btn-floating red" id="cable"><i className="material-icons">Cable</i></a></li>
             <li><a className="btn-floating red" id="tree_roots"><i className="material-icons">Tree roots</i></a></li>
             <li><a className="btn-floating red" id="wadi"><i className="material-icons">Wadi</i></a></li>
           </ul>
         </div>
        )
    }
}

export default FABComponent