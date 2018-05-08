import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo';
import InputForm from './components/InputForm/InputForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

const particlesOptions = {
	particles: {
		number: {
			value: 30,
			density: {
				enable: true,
				value_area: 800
			}
		}
	}
}

const app = new Clarifai.App({apiKey: 'b8ed28339079472896a65e2e262e5205'});

const initialState = {
	input: '',
	imageUrl: '',
	box: {},
	route: 'signin',
	isSignedIn: false,
	user: {
		id: '',
		name: '',
		email: '',
		entries: 0,
		joined: ''
	}
}

class App extends Component {
	constructor() {
		super();
		this.state = initialState;
	}
	calculateFaceLocation = (data) => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputimage');
		const width = Number(image.width);
		const height = Number(image.height);
		return {
			leftCol: clarifaiFace.left_col * width,
			topRow: clarifaiFace.top_row * height,
			rightCol: width - (clarifaiFace.right_col * width),
			bottomRow: height - (clarifaiFace.bottom_row * height)
		} 
	}

	loadUser = (data) => {
		this.setState({
			user: {
				id: data.id,
				name: data.name,
				email: data.email,
				entries: data.entries,
				joined: data.joined 
			}
		});
	}

	displayFaceBox = (box) => {
		console.log(box);
		this.setState({box : box});
	}

	onInputChange = (event) => {
		this.setState({input: event.target.value});
	}

	onButtonSubmit = (event) => {
		this.setState({imageUrl: this.state.input});
		app.models
		.predict(
			Clarifai.FACE_DETECT_MODEL, 
			this.state.input)
			.then(response => {
				if (response){
					fetch('http://localhost:3000/image',{
						method: 'put',
						headers: {'Content-type': 'application/json'},
						body: JSON.stringify({
							id: this.state.user.id
						})
					})
					.then(response => response.json())
					.then(count => {
						this.setState(Object.assign(this.state.user,{entries:count}))
					})
				}
				this.displayFaceBox(this.calculateFaceLocation(response)) 
			})				
			.catch(err => console.log(err)); 
	}

	onRouteChange = (route) => {
		if (route === 'signout'){
			this.setState(initialState);

		}else if (route === 'home'){
			this.setState({isSignedIn : true});
		}
		this.setState({route: route });
	}

	render() {
		
		return (
		  <div className="App">
		  	<Particles className='particles' params={particlesOptions}/>
		  	<Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} />
		  	{ this.state.route === 'home' 
			  	? 
			  		 <div>
					    <Logo />
					    <Rank name={this.state.user.name} entries={this.state.user.entries}/>
					    <InputForm onButtonSubmit={this.onButtonSubmit} onInputChange={this.onInputChange}/>
					    <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
					</div>
				: (this.state.route === 'signin'
					? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
					: <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
				)		
		    } 
		  </div>
		);
	}
}

export default App;
