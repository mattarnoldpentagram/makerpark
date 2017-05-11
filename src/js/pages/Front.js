import $ from 'jquery'
import 'jquery-color'
import 'slick-carousel'
import ScrollMagic from 'scrollmagic'
import 'scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap'
import 'scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators'

import Page from '../modules/Page'

import leftRailKeyframes from '../keyframes/rails'
import { heroKeyframes } from '../keyframes/hero'
import missionKeyframes from '../keyframes/mission'
import siteKeyframes from '../keyframes/site'
import visionKeyframes from '../keyframes/vision'
import timelineKeyframes from '../keyframes/timeline'
import principlesKeyframes from '../keyframes/principles'
import signupKeyframes from '../keyframes/signup'
import newsKeyframes from '../keyframes/news'
import teamKeyframes from '../keyframes/team'
import footerKeyframes from '../keyframes/footer'

import { mobileHeroKeyframes } from '../keyframes/hero'

import Viewport from '../utils/Viewport'

export default class Front extends Page {
	constructor() {
		super()

		// this.current = 'hero'
		this.sectionCtrl = new ScrollMagic.Controller()
		this.scrollCtrl = new ScrollMagic.Controller()

		this._initSections()
		// if ( Viewport.ww >= 1024 ) {
			this._initScrollScenes()
		// }
		this._initCarousels()
		this._initEvents()

	}
	// Private
	//–––––––––––––––––––––––––––————————————————————————————–––––––––––––––––––

	_initSections() {
		let _self = this
		_self.$sections = $('section')
		// _self.$sections.push($('#footer')[0])
		_self.$titles = $('.section__title')

		// track current section
		_self.$sections.map( (index, section) => {
			let $el = $(section)
			// new ScrollMagic.Scene({
			// 	triggerElement: section,
			// 	duration: $el.outerHeight()
			// })
			// .addTo(_self.sectionCtrl)
			// .on('enter leave', (e) => {
			// 	if (e.type === 'enter') {
			// 		_self.current = $el.attr('id')
			// 		$('.current').removeClass('current')
			// 		$el.addClass('current')
			// 		console.log('CURRENT: ' + _self.current)
			// 	}
			// })
			// .addIndicators({ name: item.attr('id')})

			// update background color
			if ($el.attr('id') != 'hero') {
				new ScrollMagic.Scene({
					triggerElement: section,
					duration: '50%'
				})
				.addTo(_self.sectionCtrl)
				.on('progress', (e) => {
					if (e.progress > 0) {
						let prevColor = $el.prev().attr('data-bg-color')
						let nextColor = $el.attr('data-bg-color')
						let color = $.Color(prevColor).transition(nextColor, e.progress.toFixed(3))

						$('section').css('background-color', color)
						_self.$nav.css('background-color', color)
						$('body').css('background-color', color)
					}
				})
				// .addIndicators({ name: item.attr('id')})
			}
		})

		if ( Viewport.ww >= 1024 ) {
			this.$titles.map( (index, item) => {
				let $title = $(item)
				let offset = 0
				let duration = ($title.parent().outerHeight()) - (Viewport.wh)
				console.log('duration: ' + duration)
				new ScrollMagic.Scene({
					triggerElement: item,
					duration,
					offset
				})
				.addTo(_self.sectionCtrl)
				.setPin(item)
				// .addIndicators({ name: $title.parent().attr('id') })
			})
		}
	}

	// TODO: abstract this process, optimize it
	_initScrollScenes() {
		// if (Viewport.ww < 1024) {
		// 	return;
		// }
		let _self	= this,
			rIn		= /In$/,
			rOut	= /Out$/,
			rThru	= /Thru$/,
			rMove 	= /Move$/

		// TODO: create _assembleKeyframes
		// let combinedKeyframes = this._assembleKeyframes()
		let combinedKeyframes = []
		if (Viewport.ww < 1024) {
			combinedKeyframes = [
				mobileHeroKeyframes,
				leftRailKeyframes
			]
		}
		else {
			combinedKeyframes = [
				heroKeyframes,
				missionKeyframes,
				siteKeyframes,
				visionKeyframes,
				timelineKeyframes,
				principlesKeyframes,
				signupKeyframes,
				newsKeyframes,
				teamKeyframes,
				footerKeyframes
			]
		}
		combinedKeyframes.forEach( (section, i, keyframes) => {
			if (section != undefined && section.refresh != undefined) {
				section.refresh(section.scenes)
			}
		})
		console.log(combinedKeyframes)
		combinedKeyframes.map( (section, i) => {
			section.scenes.map( (scene, j) => {
				let tween = null

				if ( rIn.test(scene.name) ) {
					tween = TweenMax.from(`${section.section} ${scene.element}`, 1, scene.tween)
				}
				else if ( rOut.test(scene.name) || rMove.test(scene.name) ) {
					tween = TweenMax.to(`${section.section} ${scene.element}`, 1, scene.tween)
				}
				else if ( rThru.test(scene.name) ) {
					tween = TweenMax.fromTo(`${section.section} ${scene.element}`, 1, scene.tween[0], scene.tween[1])
				}
				else {
					console.error(`Invalid tween type from scene ${scene.name} in ${section.section} section`)
				}

				new ScrollMagic.Scene({
					triggerElement: section.section,
					triggerHook: section.hook,
					duration: scene.duration,
					offset: scene.offset
				})
				.setTween(tween)
				.addTo(this.scrollCtrl)
				// .addIndicators({name: scene.name})
			})
		})
		this.scrollCtrl.update(true)
	}

	_refreshScrollScenes() {
		this.scrollCtrl = this.scrollCtrl.destroy(true)
		this.scrollCtrl = new ScrollMagic.Controller()
		this._initScrollScenes()
	}

	_initCarousels() {
		const $timeline = $('.timeline-carousel')
		const $renderings = $('#vision .renderings')

		if ( $timeline.length ) {
			$timeline.slick({
				infinite: true,
				dots: true,
				focusOnSelect: false,
				adaptiveHeight: true,
				prevArrow: $('.timeline-arrow--prev'),
				nextArrow: $('.timeline-arrow--next'),
			})
		}
		else {
			console.warn('no timeline carousel to initiate')
		}

		if ( $renderings.length && Viewport.ww < 1024 ) {
			$renderings.slick({
				infinite: true,
				dots: true,
				focusOnSelect: false,
				adaptiveHeight: true,
				prevArrow: $('.renderings-arrow--prev'),
				nextArrow: $('.renderings-arrow--next'),
			})
		}
		else {
			console.warn('no renderings carousel to initiate')
		}
	}

	_initEvents() {
		super._initEvents()

		$('body').on('click', '.arrow-down', this._onArrowDownClick)
	}

	// Handlers
	//–––––––––––––––––––––––––––————————————————————————————–––––––––––––––––––

	_onArrowDownClick(e) {
		e.preventDefault()
		console.log('arrow down clicked')
		// scroll to target
	}

	// Public
	//–––––––––––––––––––––––––––————————————————————————————–––––––––––––––––––

	resize() {
		Viewport.update()
		// refresh logo position
		this._refreshScrollScenes()

	}
}
