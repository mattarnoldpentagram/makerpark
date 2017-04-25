import $ from 'jquery'
import Front from './pages/Front'
import News from './pages/News'

class App {
	constructor() {
		this.page = null;
		this._initPages()
		this._initEvents()
	}

	// Private
	//–––––––––––––––––––––––––––————————————————————————————–––––––––––––––––––

	_initPages() {
		if ( $('body').hasClass('front') ) {
			this.page = new Front()
		}
		else {
			this.page = new News()
		}
	}

	_initEvents() {
		$(window).on('keydown', this._onGridShortcut)
	}

	// Handlers
	//–––––––––––––––––––––––––––————————————————————————————–––––––––––––––––––

	_onGridShortcut(e) {
		if (e.ctrlKey && e.which === 71)
			$('.grid').toggleClass('show')
	}


}

// on document ready
$( () => {
	let MP = new App()
})
