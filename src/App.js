import React from 'react';
import './css/main.css';
import './css/animations.css';

import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Routes from './components/routes/Routes';

import Messages from './components/common/Messages';

import authService from './services/auth/authService';

class App extends React.Component {
	constructor (props) {
		super(props);
	}

	componentDidMount () {
		if (sessionStorage.length === 0){
			authService
				.loginAnonymousUser()
				.then(res => {
					this.messages.showMessage('logged in as: ' + res.username);
					authService.saveSession(res);
				})
				.catch(err => {
					this.messages.showMessage(err.responseJSON.description);
				});
		}
	}

	render () {
		return (

			<div>
				<Messages onRef={ref => (this.messages = ref)}/>
				<Header/>

				<main>
					<Routes />
				</main>

				<Footer/>
			</div>

		);
	}
}

export default App;