import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import UploadObjects from "./UploadObjects";

function UploadObjectFromLocalStorage({show, objects, order, setObjectConflicts}) {

//console.log(Object.values(objects[0].diameter))
console.log({objects})
console.log({show})
console.log({order})
if (!show) return

var distance = Array(objects.length).fill(0);


var index;

//use order.length when delete object enabled? 
for (index = 0; index < objects.length; index++) {
//     objects = objects.map(({diameter, depth, distance}) => 
//     ({ diameter: parseFloat(diameter), depth: parseFloat(depth), distance: parseFloat(distance) }
// ))

  if (index == 0){
    // console.log(parseFloat(objects[index].distance));
    distance[index] = parseFloat(Object.values(objects[order[index].objectId - 1].distance)) + parseFloat(Object.values(objects[order[index].objectId - 1].diameter)/2);
    console.log(distance[index]);
  }
  else {
    for (let i = 0; i <= index; i++) {
      //console.log('object: ' + Object.values(objects[order[i].objectId - 1]).);
      if (i<index) {
        distance[index] += parseFloat(Object.values(objects[order[i].objectId - 1].distance)) + parseFloat(Object.values(objects[order[i].objectId - 1].diameter));
      }
      if ( i == index){
        distance[index] += parseFloat(Object.values(objects[order[i].objectId - 1].distance)) + parseFloat(Object.values(objects[order[i].objectId - 1].diameter))/2;
      }  
    }
  }
  console.log(distance);
}

return (
    order.map((o, i) => {
        console.log('id ' + o.objectId);
        console.log(Object.values(objects[o.objectId - 1]));
        //TRY getting rid of distance and only use distances? //TODO: reduce the number of input parameters
        return <UploadObjects object = {objects[o.objectId - 1]} distance = {distance[i]} objects= {objects} order={order} distances={distance} setObjectConflicts= {setObjectConflicts}  /> 
        
    })
  
);

}

export default UploadObjectFromLocalStorage