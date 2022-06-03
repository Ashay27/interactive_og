import React, { useContext, useEffect } from 'react'
import AppContext from './AppContext';

export default function ChangeOrder({objects, order}) {
    
  return (
    objects.map((object) => {
        return object.objectId;
    })
  )
}
