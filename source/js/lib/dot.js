
'use strict'

/**
 * Dependencies
 */
const $ = require('cash-dom')
const random = require('randf')
const velocity = require('velocity-animate')
const config = require('../../../config')

/**
 * Config
 */
const COLORS = config.dots.colors
const INTERVAL = config.dots.interval

/**
 * Export `dot`
 */
module.exports = function (parent, opts) {

	let { top, left, color, radius } = opts
	let $container = $(parent)
	let timeout

	let $el = $('<div class="dot"></div>')
	$el.css({
		background: color,
		width: radius * 2 + 'px',
		height: radius * 2 + 'px',
		top: top,
		left: left
	})

	add()

	return {
		add: add,
		remove: remove,
		el: $el
	}

	function add () {
		clearTimeout(timeout)
		$el.appendTo($container)
		velocity($el[0], {
			opacity: [1.0, 0.0]
		}, {
			duration: random(1500, 2000),
			easing: 'ease',
			complete: () => timeout = setTimeout(remove, INTERVAL)
		})
	}

	function remove () {
		velocity($el[0], {
			opacity: 0.0
		}, {
			duration: random(400, 800),
			easing: 'ease',
			complete: () => $el.remove()
		})
	}

}
