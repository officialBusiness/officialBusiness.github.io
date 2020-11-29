// import React , { useState } from 'react';
import React from 'react';
import './Dropdown.scss'

export default ({onChange, step = 1, max, min, value = 0})=>{
	// const [menuClass, setMenuClass] = useState(' hidden')
	return (
		<div className={'Dropdown'} 
			onMouseEnter={(e)=>{
				// setMenuClass('')
			}}
			onMouseLeave={(e)=>{
				// setMenuClass('')
			}}>
			<div className={'dropdown-back'}>
				<span>下拉菜单</span>
			</div>
			<div className={'menu'} >
				{
					[1,2,3,4].map((item, index)=>{
						return (
							<div className={'menu-item'} key={index} onClick={(e)=>{
								console.log('点击了选项', index)
							}}>选项{index}</div>
						)
					})
				}
			</div>
		</div>
	)
}

