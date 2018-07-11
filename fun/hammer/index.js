function $(el) {
	return document.querySelector(el)
}

function $$(el) {
	return document.querySelectorAll(el)
}

function debounce(fn, wait) {
	let timeout, args, context, timestamp, result

	function later() {
		let last = Date.now() - timestamp
		if (last > 0 && last < wait) {
			timeout = setTimeout(later, wait - last)
		} else {
			timeout = null
			result = fn.apply(context, args)
		}
	}

	return function () {
		context = this
		args = arguments
		timestamp = Date.now()
		if (!timeout) {
			timeout = setTimeout(later, wait);
		}
	}
}


let $el = $('.move')
let $tabs = $$('.nav li')
let activeIndex = 0

var hammertime = new Hammer($el)

function handle(ev) {
	var type = ev.type
	if (type === 'panleft' && activeIndex < $tabs.length - 1) {
		activeIndex += 1
	}
	if (type === 'panright' && activeIndex >= 1) {
		activeIndex -= 1
	}
	$tabs.forEach(item => {
		item.classList.remove('active')
	})
	$tabs[activeIndex].classList.add('active')
	$el.textContent = activeIndex + 1
}

hammertime.on('panleft panright', debounce(handle, 50));
