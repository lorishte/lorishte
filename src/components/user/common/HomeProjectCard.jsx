import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Constants
import {BUTTONS} from '../../../constants/constants'

function HomeProjectCard (props) {

	let {project, activeLanguage} = props;

	let pathLang = activeLanguage === 'en' ? '/' + activeLanguage : '';
	let linkPath = pathLang + '/projects/' + project._id;


	return (
		<section className='home-project'>

			<figure className="img-container">
				<img className="img-fit" src={project.thumbnail} alt={project.name[activeLanguage]}/>
			</figure>

			<div className="project-info">
				<div>
					<p className='project-name'>{project.name[activeLanguage]}</p>
					<p className='cliche'>{project.description[activeLanguage]}</p>
				</div>
				<Link to={linkPath} className="btn btn-default-light lg">{BUTTONS[activeLanguage].seeProject}</Link>
			</div>
		</section>
	);

}

export default HomeProjectCard;

HomeProjectCard.propTypes = {
	project: PropTypes.object,
	activeLanguage: PropTypes.string,
};