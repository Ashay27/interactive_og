import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import UploadObjects from "./UploadObjects";
import GetObject from "./GetObject";


function AddObjectsFromCSVModal({show, objects}) {

  console.log({objects})
console.log({show})
if (!show) return

var distance = Array(50).fill(0);


var index;
for (index = 0; index < objects.length; index++) {
  if (index == 0){
    distance[index] = parseFloat(objects[index].distanceOnLeft) + parseFloat(objects[index].diameter)/2;
  }
  else {
    for (let i = 0; i <= index; i++) {
      if (i<index) {
        distance[index] += parseFloat(objects[i].distanceOnLeft) + parseFloat(objects[i].diameter);
      }
      if ( i == index){
        distance[index] += parseFloat(objects[i].distanceOnLeft) + parseFloat(objects[i].diameter)/2;
      }  
    }
  }
  console.log(distance);
}

return (
  
    objects.map((object, i) => {
      //return <GetObject object = {object} distance = {distance[i]}  />
      return <UploadObjects object = {object} distance = {distance[i]}  />
    })
);

}

export default AddObjectsFromCSVModal