import React from 'react';
import { LanguageContext } from '../../common/languagesContext/LanguageContext';
import ScrollAnimation from 'react-animate-on-scroll';

// Partials
import PageHeader from '../common/headers/PageHeader';
import OurAim from './partials/OurAim';
import OurPhilosophy from './partials/OurPhilosophy';
import Services from './partials/Services';
import Projects from './partials/Projects';
import AboutUs from './partials/AboutUs';
import BlockQuote from '../common/articlePartials/BlockQuote';

// Services
import authService from '../../../services/auth/authService';
import projectsService from '../../../services/projects/projectsService';
import HomeProjectCard from '../common/projects/HomeProjectCard';

//Constants
import { BUTTONS } from '../../../constants/constants';

class Home extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			projects: [],

			clients: [],
			categories: [],

			loading: true,

			videoMuted: true
		};

		this.video = React.createRef();
		this.unmuteBtn = React.createRef();
	}

	componentDidMount () {

		// Log anonymous user if storage is empty
		if (sessionStorage.getItem('authtoken') === null) {
			authService
				.loginAnonymousUser()
				.then(res => {
					authService.saveSession(res);
					this.loadStarProjects();
				})
				.catch(err => this.notifications.showMessage(err.responseJSON.description));

			return;
		}

		this.loadStarProjects();
	}

	loadStarProjects = () => {

		let query = '?query={"isStar":true,"isBlocked":false}';

		projectsService
			.loadAllProjects(query)
			.then(res => {
				res.sort((a, b) => Number(a.orderNumber) - Number(b.orderNumber));
				this.setState({projects: res});
			})
			.catch(err => {
				this.notifications.showMessage(err.responseJSON.description);
			});
	};

	toggleVideoControls = () => {
		let video = this.video.current;

		video.controls = true;
		this.unmuteBtn.current.classList.add('invisible');

		this.setState({videoMuted: !this.state.videoMuted});
	};

	render () {

		let activeLanguage = this.context.language;

		let projects = Object.assign([], this.state.projects);

		let accentProject = projects.shift();

		return (
			<div id="home" className='container-fluid'>

				<PageHeader language={activeLanguage} pageName='home'/>

				<section id='video' className='container'>

					<video loop
					       autoPlay
					       muted={this.state.videoMuted}
					       controls={false}
					       controlsList="nodownload"
					       className='carousel-video'
					       ref={this.video}>
						<source src='videos/home/video.mp4' type="video/mp4"/>
					</video>

					<button id='unmute-btn'
					        ref={this.unmuteBtn}
					        onClick={this.toggleVideoControls}>
						{/*{this.state.videoMuted && <i className="fa fa-volume-up" aria-hidden="true"/>}*/}
						{/*{!this.state.videoMuted && <i className="fa fa-volume-off" aria-hidden="true"/>}*/}
						{BUTTONS[activeLanguage].playWithAudio}

						<span className="slider"/>

					</button>
				</section>

				<OurAim language={activeLanguage}/>

				<HomeProjectCard activeLanguage={activeLanguage} project={accentProject}/>

				<OurPhilosophy language={activeLanguage}/>

				<Projects projects={projects} language={activeLanguage}/>

				<Services language={activeLanguage}/>

				<BlockQuote language={activeLanguage}
				            pageName='home'
				            sectionName='quote'/>

				<AboutUs language={activeLanguage}/>

			</div>

		);
	}
}

Home.contextType = LanguageContext;

export default Home;