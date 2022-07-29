import React, {useContext} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppContext from './AppContext';
import GetObject from './GetObject';

const LOCAL_ORDER_KEY = 'localData.order'

function GetAllObjects({storedObjectsOrder, updatedObjectId, updatedState}) {
const appContext = useContext(AppContext);
if(updatedState === 'ADDED'){
    var orderList = storedObjectsOrder.slice();
    orderList.push(updatedObjectId)
    console.log("orderList: " + orderList)
    var updatedOrder = appContext.storedObjectsUpload.slice();
    console.log("Objects: " + Object.values(appContext.storedObjectsUpload))
    console.log("Updated Order: " + Object.values(updatedOrder))
    updatedOrder = updatedOrder.filter(o => orderList.includes(o.objectId))
    updatedOrder.sort((a, b) => {
          return a.distance.distance - b.distance.distance;
    });
    console.log("Updated Order: " + Object.values(updatedOrder))
    var order = updatedOrder.flatMap(o => o.objectId)
    console.log("Order: " + order)
    appContext.setStoredObjectsOrder(order);
    localStorage.setItem(LOCAL_ORDER_KEY, JSON.stringify(order))

    console.log(Object.values(storedObjectsOrder))
    appContext.setUpdatedState('NONE')
}

if(updatedState === 'DELETED'){
    var order = storedObjectsOrder.slice();
    order = order.filter(o => !(o == updatedObjectId))

    appContext.setStoredObjectsOrder(order);
    localStorage.setItem(LOCAL_ORDER_KEY, JSON.stringify(order))

    console.log(Object.values(storedObjectsOrder))
    appContext.setUpdatedState('NONE')
}
  return (
    storedObjectsOrder.map((o) => {
        console.log('id ' + o);
        return (
            <GetObject objectId = {o} />
        )
    }) 
 );
}

export default GetAllObjects;
