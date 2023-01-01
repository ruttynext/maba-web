import {React, useState} from 'react';
import capture from './capture.png';

const arr = [
    { name: "T1", position: {x: 377, y: 10, active: false, offset: {}}},
    { name: "T2", position: {x: 377, y: 30, active: false, offset: {}}},
    { name: "T3", position: {x: 377, y: 50, active: false, offset: {}}},
    { name: "T4", position: {x: 377, y: 70, active: false, offset: {}}},
    
    
];

function ChannelMapping(props) {
   
    const [ragashimList, setRagashimList] = useState(arr);


const handlePointerDown = (e, name) => {

     const el = e.target;
     const bbox = e.target.getBoundingClientRect();
     const x = e.clientX - bbox.left;
     const y = e.clientY - bbox.top;
     el.setPointerCapture(e.pointerId);

     setRagashimList(ragashimList.map(item => (item.name === name ? 
        {...item, 
            'position' : {
                ...item.position,
                active: true,
                offset: {x, y}},
        } : item)));

};
const handlePointerMove = (e, name, position) => {

    const bbox = e.target.getBoundingClientRect();
    const x = e.clientX - bbox.left;
    const y = e.clientY - bbox.top;

    if (position.active) {
        setRagashimList(ragashimList.map(item => (item.name === name ? 
            {...item, 
                'position' : {
                    ...position,
                    x: position.x - (position.offset.x - x),
                    y: position.y - (position.offset.y - y)
                  },
            } : item)));
    }

  };

  const handlePointerUp = (e, name, position) => {

    setRagashimList(ragashimList.map(item => (item.name === name ? 
        {...item, 
            'position' : {
                ...position,
                active: false
              },
        } : item)));

  };

    return (
        <div>
            <svg height="400" width="400">
                <image href={capture} height="200" width="200"/>
                 {
                    ragashimList.map(({ name, position }, index) => 
                    {             
                        return(
                            <g fill={position.active ? "blue" : "brown"} style={{cursor : "grabbing" }} onPointerDown={(e) => handlePointerDown(e, name)} 
                              onPointerUp={(e) => handlePointerUp(e, name, position)} onPointerMove={(e) => handlePointerMove(e, name, position)}>
                                <circle cx={position.x} cy={position.y} r="4" />   
                                <text x={position.x + 23} y={position.y + 5} >{name}</text>
                            </g>);
                    })
                }               
            </svg>
        </div>
    );
}

export default ChannelMapping;