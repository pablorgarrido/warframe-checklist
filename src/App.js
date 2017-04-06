import React, { Component } from 'react';
import emptyList from './data/empty-list.js';
import listData from './data/list-data.js';
import BrowserCompatability from './components/BrowserCompatability.js';
import ItemList from './components/ItemList.js'
import './App.css';

class App extends Component {
  constructor(props) {
      super(props);
      this.setProperty = this.setProperty.bind(this);
      var list = emptyList;
      if (typeof(Storage) !== "undefined") {
        if(localStorage.getItem("warframe-item-checklist")){
          list = JSON.parse(localStorage.getItem("warframe-item-checklist"));
        }
      }
      if (list.version !== emptyList.version){
        emptyList.lists.forEach((category) => {
          category.list.forEach((item) => {
            let currentCategory = (list.lists.find(x => x.title === category.title ));
            if( currentCategory.list.find(x => x.title === item.title ) === undefined ){
              currentCategory.list.push(item);
              currentCategory.list = currentCategory.list.sort((a, b) => {
                if (a.title < b.title){
                  return -1;
                }
                if (a.title > b.title){
                  return 1;
                }
                return 0;
              });
            }
          });
        });
        list.lists = list.lists.sort((a,b) => {
          return emptyList.lists.findIndex( x => x.title === a.title) - emptyList.lists.findIndex( x => x.title === b.title);
        })
        list.version = emptyList.version;
        localStorage.setItem("warframe-item-checklist", JSON.stringify( list ));
      }
      this.state = {
        listData,
        list,
      };
  }

  setProperty(category, item, property, value) {
    let newList  = this.state.list;
    newList.lists.find(
      x => x.title === category
    ).list.find(
      x => x.title === item
    )[property] = value;
    this.setState({list: newList});

    localStorage.setItem("warframe-item-checklist", JSON.stringify( newList ));
  }

  render() {
    const subLists = this.state.list.lists.map((list) =>
      <ItemList list={list} itemDataList={this.state.listData.lists.find(x => x.title === list.title)} updateFunction={this.setProperty} key={list.title}></ItemList>
    );

    return (
      <div className="App">
        <div className="App-header">
          <h2>Warframe Checklist</h2>
          <p>Last Updated For:</p>
          <p>OCTAVIA'S ANTHEM | 2017.04.05.15.18</p>
        </div>
        <br />
        <i>Please Note: Clearing your Cache or Cookies will delete your progress.</i><br />
        <p className="App-intro">
          Created by asdfjackal and CommissarXyz<br />
          If you would like to support future versions you can send us stuff in-game using our names above<br />
          -or-<br />
          <a href='https://ko-fi.com/A067YUP'>Buy Us Some Plat</a><br />
          Contribute at <a href="https://github.com/asdfjackal/warframe-checklist">github</a> or follow development at <a href="https://twitter.com/asdfJackal">twitter</a>
        </p>
        <BrowserCompatability>
          <div className="container">{subLists}</div>
        </BrowserCompatability>
      </div>
    );
  }
}

export default App;
