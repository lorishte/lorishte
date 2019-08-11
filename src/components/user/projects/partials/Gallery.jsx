import React from 'react';
import PropTypes from 'prop-types';

class Gallery extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			translateValue: 0,
			step: 0,
			imageIndex: 0
		};

		this.container = React.createRef();
	}

	componentWillMount () {
		document.addEventListener('keydown', this.handleKeyPress);
	}

	componentWillUnmount () {
		document.removeEventListener('keydown', this.handleKeyPress);
	}

	handleKeyPress = (e) => {

		if (e.key === 'ArrowLeft') this.moveCarousel('left');

		if (e.key === 'ArrowRight') this.moveCarousel('right');
	};

	getCurrentImageWidth = (direction, callback) => {

		let index = this.state.imageIndex;

		if (direction === 'left' && index > 0) index -= 1;

		let el = 'img' + index;

		// Get parent width with included padding
		let currentImageWidth = this[el].current.parentNode.clientWidth;

		this.setState({step: currentImageWidth}, () => callback());
	};

	moveCarousel = (direction) => {

		this.getCurrentImageWidth(direction, () => {

			let container = this.container.current;

			let step = this.state.step;
			let translateValue = this.state.translateValue;
			let translateMaxValue = container.scrollWidth;

			let nextImageIndex;

			if (direction === 'left') {

				if (translateValue <= 0) return;

				translateValue -= step;

				if (translateValue < 0) translateValue = 0; // fix bug if value goes negative

				nextImageIndex = this.state.imageIndex - 1;

			} else {

				translateValue = this.state.translateValue + step;

				if (translateValue > translateMaxValue - step) return;

				nextImageIndex = this.state.imageIndex + 1;
			}

			this.setState({
				translateValue,
				imageIndex: nextImageIndex
			}, () => {
				window.requestAnimationFrame(function () {
					container.style.transform = `translateX(-${translateValue}px)`;
					container.style.transition = '.6s ease-out';
				});
			});
		});
	};

	render () {

		let lang = this.props.language;

		let gallery = this.props.images.map((element, i) => {

			for (let el in element.info) {
				let section = this.props.sections.filter(s => s._id === el)[0];
				element[section.name.en] = element.info[el];
			}

			let name = 'img' + i;

			this[name] = React.createRef();

			return (
				<div key={name} className='image-container'>
					<figure className="image"
					        ref={this[name]}
					        onLoad={() => {
						        let img = this[name].current;
						        if (img.clientWidth > img.clientHeight) {
							        img.parentNode.classList.add('portrait');
						        }
					        }}>
						<img src={element.url}
						     className="img-fit"
						     alt={element.url}
						     data-target={JSON.stringify(element)}
						     onClick={this.props.showPreview}/>
					</figure>

					<span className='btn md'
					      data-target={JSON.stringify(element)}
					      onClick={this.props.showPreview}>
						View
					</span>

					{element.Headline &&
					<div className='name' dangerouslySetInnerHTML={{__html: element.Headline[lang]}}/>
					}
				</div>
			);
		});

		return (
			<div id="project-gallery">


				<div id='gallery' ref={this.container}>
					{gallery}
				</div>


				<div className="gallery-navigation">
					<button className={this.state.imageIndex === 0 ? 'btn btn-default md disabled' : 'btn btn-default md'}
					        onClick={() => this.moveCarousel('left')}>
						<i className="fa fa-arrow-left" aria-hidden="true"/>
					</button>
					<button
						className={this.state.imageIndex === (this.props.images.length - 1) ? 'btn btn-default md disabled' : 'btn btn-default md'}
						onClick={() => this.moveCarousel('right')}>
						<i className="fa fa-arrow-right" aria-hidden="true"/>
					</button>
				</div>
			</div>
		);
	}
}

export default Gallery;

Gallery.propTypes = {
	images: PropTypes.array,
	language: PropTypes.string,
	sections: PropTypes.array,
	showPreview: PropTypes.func
};