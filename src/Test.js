import React from 'react';
import Triangle from './components/Triangle.js'
import Arrow from './components/Arrow.js'
import InputNumber from './components/InputNumber.js'
import Dropdown from './components/Dropdown.js'


function Test() {
	return (
		<div style={{
			marginLeft: '10px'
		}}>
			<Triangle />
			<br/>
			<Arrow />
			<br/>
			<InputNumber />
			<br/>
			<Dropdown />
			<br/>
		</div>
	);
}

export default Test