// document.body.innerText = 'Hello, myBlog';


import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
 
const Hello = () => {
	return <h1>Hello, world!</h1> ;
}
 
ReactDOM.render(
	<Hello/>,
	document.body
);