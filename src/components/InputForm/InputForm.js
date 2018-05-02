 import React from 'react';
import './InputForm.css';
const InputForm = ({onInputChange,onButtonSubmit}) => {
	return (
		<div>
			<p className="f3">This magic brain will detect faces in your pictures. Give it a try!</p>
			<div className="center">			
				<div className='form center pa4 br3 shadow-5'>
					<input onChange={onInputChange} className='f4 pa2 w-70 center' type="text" />
					<button onClick={onButtonSubmit} className='f4 link ph3 pv2 div white bg-light-purple w-30 grow' >Detect</button> 
				</div>
			</div>
		</div>
	);
}

export default InputForm;