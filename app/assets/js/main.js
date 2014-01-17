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
			insult += '{marginalized.nouns}-{marginalized.verbs}, '
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
	    length = Math.round((typeof minLength === 'undefined' ? 3 : minLength) + Math.random() * (typeof maxRandom === 'undefined' ? 5 : maxRandom)),
	    dist = {
		    insult: Math.round(0.2 * length),
		    statement: Math.round(0.8 * length),
	    }, i

	for (i = 0; i < dist.insult; i += 1) {
		paragraph.push(generateInsult(Math.random() > 0.3) + '!')
	}

	paragraph = paragraph.concat(_.map(_.sample(tumblr.resources.statements, dist.statement), function (val) {
		if (Math.random() > 0.5) {
			return val
		}
		var text = val.slice(0, -1),
		    punc = val.slice(-1)

		// Randomly add some extra insults to statements
		return text + (' you ' + (Math.random() > 0.3 ? '{insults.adjectives} ' : '') + '{insults.nouns}') + punc
	}))

	paragraph = _.shuffle(paragraph)

	paragraph[0] = '{intros} ' + paragraph[0]

	if (Math.random() > 0.5) {
		paragraph.push('{conclusions} {insults.statements}')
	}

	return paragraph.join(' ').replaceTerms().tumblrize(mangleGrammar)
}

generateUsername = function() {
	return '{marginalized.nouns}'.randomRepeat(2, 2).replaceTerms().toLowerCase().replace(/[^a-z]/g, '')
}

renderInsult = function () {
	$('#insult')
		.empty()
		.append($('<p>').text(generateInsult(true).tumblrize(false).toUpperCase()))
}

renderBlog = function () {
	var randomAge = 13 + Math.floor(Math.random() * 10),
	    ownerUsername = generateUsername(),
	    mangleChance = 0.4,
	    i, title, about, presentation, argument, reblogs = [], reblogContainer, hashtags = []

	// Add title and presentation
	title = tumblr.resources.titles.random().replaceTerms()
	about = [randomAge, '{alignments}', '{politics.nouns}'].join(' / ').replaceTerms()
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
	_.forEach(_.sample(tumblr.resources.concepts.awesome, 5 + Math.floor(Math.random() * 3)), function (concept) {
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

	if ($('body').css('background-image').indexOf(window.currentBackgroundImage) === -1) {
		$('body').css('background-image', 'url(static/img/bg/' + window.currentBackgroundImage + ')')
	}
}

$(document).ready(function () {
	// Randomly switch background every now and then
	window.currentBackgroundImage = tumblr.resources.images.backgrounds.random()
	window.setInterval(function () { window.currentBackgroundImage = tumblr.resources.images.backgrounds.random() }, 4000)

	// Add some stats
	$('.privileged-groups-length').text(' ' + (tumblr.resources.privileged.adjectives.length * tumblr.resources.privileged.nouns.length) + ' ')
	$('.marginalized-groups-length').text(' ' + (tumblr.resources.marginalized.nouns.length * tumblr.resources.marginalized.verbs.length) + ' ')

	renderBlog()
	renderInsult()

	$('#controls button.generate-insult').click(function () {
		$('#insult').show()
		renderInsult()
	})
	$('#controls button.generate-blog').click(function () {
		$('#insult').hide()
		renderBlog()
	})
})
