var generateInsult,
    generateParagraph,
    generateUsername,
    renderInsult,
    renderBlog

generateInsult = function (initialInsult) {
	var insult = ''

	if (initialInsult) {
		insult += '{insults.statements}, you '

		if (Math.random() > 0.3) {
			insult += '{insults.adjectives} '
		}
		if (Math.random() > 0.3) {
			insult += '{marginalized.nouns|marginalized.adjectives}-{marginalized.verbs}, '
		}
	}
	else {
		insult += 'you '
	}

	insult += '{privileged.nouns}-{privileged.adjectives} {insults.nouns}'

	return insult.replaceTerms()
}

generateParagraph = function (mangleGrammar, minLength, maxRandom) {
	var paragraph = [],
	    length = Math.round((typeof minLength === 'undefined' ? 3 : minLength) + Math.random() * (typeof maxRandom === 'undefined' ? 5 : maxRandom))

	paragraph = _.map(_.sample(tumblr.resources.statements, length), function (val) {
		if (! val[1] || Math.random() > 0.7) {
			return val[0]
		}

		var text = val[0].slice(0, -1),
		    punc = val[0].slice(-1)

		// Randomly add some extra insults to statements
		return text + ', ' + generateInsult(false) + punc
	})

	paragraph[0] = '{intros} ' + paragraph[0]

	if (Math.random() > 0.5) {
		paragraph.push('{conclusions} {insults.statements}!')
	}

	return paragraph.join(' ').replaceTerms().tumblrize(mangleGrammar)
}

generateUsername = function () {
	return '{marginalized.nouns}'.randomRepeat(2, 2).replaceTerms().toLowerCase().replace(/[^a-z]/g, '')
}

renderInsult = function () {
	$('#insult')
		.empty()
		.append($('<p>').text(generateInsult(true).tumblrize(false).toUpperCase()))
}

renderBlog = function () {
	randomStyle()

	var randomAge = 13 + Math.floor(Math.random() * 10),
	    ownerUsername = generateUsername(),
	    mangleChance = 1 - 0.2,
	    i, title, about, presentation, argument, reblogs = [], reblogContainer, hashtags = []

	// Add title and presentation
	title = tumblr.resources.titles.random().replaceTerms()
	about = [randomAge, '{alignments}', '{politics.nouns}', '{politics.nouns}', '{politics.nouns}'].join(' / ').replaceTerms()
	presentation = _.map(_.sample(tumblr.resources.presentations, 5), function (p) {
		return $('<li>').text(p.replaceTerms().tumblrize() + '.')
	})

	// Create argument
	argument = $('<p>').attr('class', 'top').text(generateParagraph(Math.random() > mangleChance))
	for (i = 0; i < 2 + Math.random() * 3; i += 1) {
		argument = $('<div>').append(
			$('<cite>').text(generateUsername() + ':'),
			$('<blockquote>').append(argument),
			$('<p>')
				.attr('class', 'reply')
				.text(Math.random() > 0.6 ?
				      generateParagraph(Math.random() > mangleChance) :
				      (generateInsult(true) + '!').tumblrize(Math.random() > mangleChance))
		)
	}

	// Randomly replace an argument with an image
	$(_.sample(argument.find('.reply'))).empty().append($('<img>').attr('src', 'static/img/inline/' + tumblr.resources.images.inline.random()))

	// Add hashtags
	_.forEach(_.sample(tumblr.resources.concepts.awesome, 3 + Math.floor(Math.random() * 3)), function (concept) {
		hashtags.push($('<li>').text('#' + concept))
	})

	// Add reblogs/likes
	for (i = 0; i < 5 + Math.random() * 10; i += 1) {
		reblogContainer = $('<li>')
		reblogContainer.append($('<strong>').attr('class', 'username').text(generateUsername()))

		if (Math.random() > 0.7) {
			reblogContainer
				.append($('<span>').attr('class', 'reblog').text(' reblogged this from ' + ownerUsername + ' and added:'))
				.append($('<p>').attr('class', 'insult').text((generateInsult(true) + '!').tumblrize(true)))
		}
		else {
			reblogContainer
				.append($('<span>').attr('class', 'like').text(' likes this'))
		}

		reblogs.push(reblogContainer)
	}

	$('#title').text(title)
	$('#username').text('hi, i\'m ' + ownerUsername + '!')
	$('#about').text(about)
	$('#presentation').empty().append(presentation)
	$('#copyright').empty().append('copyright © 2012-' + (new Date().getFullYear()) + ' ' + ownerUsername + '. all rights reserved worldwide. theme by ' + generateUsername() +', modified by ' + ownerUsername + '.')
	$('#argument').empty().append(argument)
	$('#hashtags').empty().append(hashtags)
	$('#reblogs').empty().append(reblogs)

	// Update to a random background image
	$('body').css('background-image', 'url(static/img/bg/' + tumblr.resources.images.backgrounds.random() + ')')
}

$(document).ready(function () {
	var headerAnim

	// Add some stats
	$('.privileged-groups-length').text(' ' + (tumblr.resources.privileged.adjectives.length * tumblr.resources.privileged.nouns.length) + ' ')
	$('.marginalized-groups-length').text(' ' + ((tumblr.resources.marginalized.nouns.length + tumblr.resources.marginalized.adjectives.length) * tumblr.resources.marginalized.verbs.length) + ' ')

	// Highlight the header
	headerAnim = function () {
		$('#controls span')
			.animate({opacity: 1}, 500)
			.animate({opacity: 0.6}, 500)
			.animate({opacity: 1}, 500)
			.animate({opacity: 1}, 1000, headerAnim)
	}
	headerAnim()

	renderBlog()

	$('#controls button.generate-insult').click(function () {
		$('#contents').hide()
		$('#insult').show()
		renderInsult()
	})
	$('#controls button.generate-blog').click(function () {
		$('#contents').show()
		$('#insult').hide()
		renderBlog()
	})
})
