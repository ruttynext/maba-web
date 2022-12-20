import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import React from 'react'

    
    /* removes the element from list to which the element is moved from  */
    const removeFromList = (list, index) => {
        
        const result = Array.from(list);
        const [removed] = result.splice(index, 1);
        return [removed, result];
    };

    /* Adds the element to list to which the element is dragged */
    const addToList = (list, index, element) => {

        const result = Array.from(list);
        result.splice(index, 0, element);
        return result;
    };
   


    /*  implement of drag-and-drop elements */
    export const DragDropContainer = ({elements, setElements, style}) =>
    {
        /* event when the drag end */
        const onDragEnd = (result) => {
           
            if (!result.destination) {
              return;
            }
            
            const listCopy =  Array.from(elements);
                      
            const sourceList = listCopy[result.source.droppableId].elements;
            const [removedElement, newSourceList] = removeFromList(
              sourceList,
              result.source.index
            );
           
            listCopy[result.source.droppableId].elements = newSourceList;
         
            const destinationList = listCopy[result.destination.droppableId].elements;
          
            listCopy[result.destination.droppableId].elements = addToList(
              destinationList,
              result.destination.index,
              removedElement
            );
            
            setElements(listCopy);
          };

       return(
       
        <DragDropContext onDragEnd={onDragEnd}>   
            <div style={{...style}}>
                {elements.map((item) => (
                    <DraggableElement
                    elements={item.elements}
                    key={item.id}
                    prefix={item.id}
                    />
                ))}
            </div>       
       </DragDropContext>
     )
    };

 const DraggableElement = ({ prefix, elements }) => (
  
    <Droppable droppableId={`${prefix}`} direction="horizontal"  style={{display: "flex"}}>
      {(provided, snapshot) => (
        <div {...provided.droppableProps} ref={provided.innerRef} style={{minWidth: "Nan",}} className='flex-container'>
          {elements.map((item, index) => (
            <ListItem key={item.id} item={item} index={index} />
          ))}
         
        </div>
      )}
    </Droppable>
  
  );
  
  
   const ListItem = ({ item, index }) => {
  
    return (
      <Draggable draggableId={item.id} index={index}>
        {(provided, snapshot) => {
          return (
            <div
              ref={provided.innerRef}
              snapshot={snapshot}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
           
                {item.content}
               
            </div>
          );
        }}
      </Draggable>
    );
  };