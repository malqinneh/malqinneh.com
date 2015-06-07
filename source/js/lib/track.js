
/**
 * Module dependencies
 */
var $ = require('cash-dom')

/**
 * Export `track`
 */
module.exports = function (selector, eventName, props) {

	var $el = $(selector)
	var href = $el.attr('href')

	$el.on('click', function (e) {
		analytics.track(eventName, props)
    if (e.metaKey !== true || e.ctrlKey !== true || e.which !== 2) return
  	if (!href) return
    e.preventDefault()
  	setTimeout(() => (window.location = href), 100)
	})

}