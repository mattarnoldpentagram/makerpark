export default const heroKeyframes = {
	section			:	'#hero',
	hook			:	'onLeave',
	scenes: [
		{
			name	:	'heroBGOut',
			duration:	h,
			offset	:	0,
			tween	:	TweenMax.to('#hero .hero-bg', 1, {y: -500, ease: Linear.easeNone}) //prev: y:-735
		},
		{
			name	:	'logoTransform',
			duration:	h,
			offset	:	0,
			tween	:	TweenMax.to('#hero .hero-logo', 1, {y: 534, x: 816, scale: .3, rotation: 360, ease:Power2.easeInOut})
		}
	]
};
