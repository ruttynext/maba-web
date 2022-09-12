import React from 'react';
// import { Menu } from "@progress/kendo-react-layout";
import './MainNavBar.css'
import {useNavigate, history } from 'react-router-dom';
import { Drawer, DrawerContent, Menu } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';


function MainNavbar(props) {
    const items = [
        {
          text: 'ניהול אתר',
          selected: true,
          route: '/SiteManagement',
          icon: 'heart',
        },
        {
            text: 'טמפרטורה',
            items: [
                {
                    text: 'חימום',
                    route: '/',
                },
                {
                    text: 'תנורים',
                    route: '/Oven',
                },
                {
                    text: 'נוזל'
                }
            ],
        },
        {
          text: 'חשמל',
          items: [
            {
                text: 'מקררים',
            },
            {
                text: 'מכוניות',
            },

        ],
        },
      ];
      
    
    const navigate = useNavigate();
  
  
  
    const onSelect = (e) => {
      navigate(e.item.route);
    };
  
    return (
        <div className='c- main-nav-bar'>
            <Menu items={items.map((item) => ({
            ...item,

          }))}
          onSelect={onSelect}></Menu>
      </div>

    );
}

export default MainNavbar;