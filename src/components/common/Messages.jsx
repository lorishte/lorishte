import React from 'react';

class Messages extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			visible: false,
			message: ''
		};
	}

	componentDidMount () {
		this.props.onRef(this);
	}

	componentWillUnmount () {
		this.props.onRef(undefined);
	}

	showMessage = (message) => {
		this.setState({
			visible: true,
			message: message
		});
	};

	hideMessage = () => {
		this.setState({
			visible: false,
			message: ''
		});
	};

	render () {

		let isVisible = this.state.visible;

		return (
			<div id="messages"
			     className={isVisible ? 'visible' : ''}
			     onClick={this.hideMessage}>
				<div className="message">
					<p className="message-text">{this.state.message}</p>

					<button className="btn btn-primary" onClick={this.hideMessage}>Close</button>
				</div>

			</div>
		);
	}
}

export default Messages;

