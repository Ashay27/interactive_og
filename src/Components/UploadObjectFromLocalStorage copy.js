import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import UploadObjects from "./UploadObjects";

function UploadObjectFromLocalStorage({show, objects}) {

//console.log(Object.values(objects[0].diameter))
console.log({objects})
console.log({show})
if (!show) return

var distance = Array(objects.length).fill(0);


var index;


for (index = 0; index < objects.length; index++) {
//     objects = objects.map(({diameter, depth, distance}) => 
//     ({ diameter: parseFloat(diameter), depth: parseFloat(depth), distance: parseFloat(distance) }
// ))

  if (index == 0){
    // console.log(parseFloat(objects[index].distance));
    distance[index] = parseFloat(Object.values(objects[index].distance)) + parseFloat(Object.values(objects[index].diameter)/2);
    console.log(distance[index]);
  }
  else {
    for (let i = 0; i <= index; i++) {
      if (i<index) {
        distance[index] += parseFloat(Object.values(objects[i].distance)) + parseFloat(Object.values(objects[i].diameter));
      }
      if ( i == index){
        distance[index] += parseFloat(Object.values(objects[i].distance)) + parseFloat(Object.values(objects[i].diameter))/2;
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

export default UploadObjectFromLocalStorage