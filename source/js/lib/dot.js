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
const DELAY = config.dots.delay

/**
 * Export `dot`
 */
module.exports = function (opts) {
	
	let { top, left, color, radius } = opts
	let timeout
	
	let $container = $(opts.container)
	let $el = $('<div class="dot"></div>')
	$el.css({
		background: color,
		width: radius * 2 + 'px',
		height: radius * 2 + 'px',
		top,
		left
	})
	
	add()
	
	return {
		add: add,
		remove: remove
	}
	
	function add () {
		clearTimeout(timeout)
		$el.appendTo($container)
		velocity($el[0], {
			opacity: [1.0, 0.0],
			scale: [1.0, 1.5]
		}, {
			duration: random(1500, 2000),
			easing: 'spring',
			complete: function () {
				timeout = setTimeout(remove, DELAY)
			}
		})
	}
	
	function remove () {
		velocity($el[0], {
			opacity: 0.0,
			scale: 0.5
		}, {
			duration: random(400, 800),
			easing: 'easeOutExpo',
			complete: function() {
				$el.remove()
			}
		})
	}
	
}