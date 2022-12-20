import React from 'react';
import './HomePage.css';
import { TreeView } from "@progress/kendo-react-treeview";

const tree = [
    {
      text2: "Furniture",
      
      items2: [
        {
          text: "Tables & Chairs",
        },
        {
          text: "Sofas",
        },
        {
          text: "Occasional Furniture",
        },
      ],
    },
    {
      text2: "Decor",
      items2:  [
        
        {
          text: "rutty",
        },
      ],
    },
  ];
  const MyItem = (props) => {
    console.log("MyItem");
    console.log(props);
    return (
      <>
        <span key="0" /> {props.item.items2 ? props.item.text2 : props.item.text}
      </>
    );
  };
function HomePage(props) {

    const [data, setData] = React.useState(tree);

    const onExpandChange = (event) => {
      console.log("onExpandChange");
      console.log(event);
      event.item.expanded = !event.item.expanded;
     // setData([...data]);
    };


    return (
        <div>
            <TreeView item={MyItem} data={data} expandIcons={true}
             onExpandChange={onExpandChange} childrenField={"items2"} textField={"text2"}  />
        </div>
    );
}

export default HomePage;